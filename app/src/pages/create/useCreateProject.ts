import { utils } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { encodeFunctionData } from 'viem'
import { usePublicClient } from 'wagmi'

import { PENDING_PERIOD, QUIET_ENDING_PERIOD, VOTING_PERIOD } from '../../config/appConfig'
import { useLoadingContext } from '../../contexts/LoadingContext'
import { useToast } from '../../contexts/ToastsContext'
import { registryABI, registryFactoryABI } from '../../contracts/abis'
import { I18Keys } from '../../i18n/kyel.list'
import { DetailsAndPlatforms, HexStr, PAP, SelectedDetails } from '../../shared/types'
import { getFactoryAddress } from '../../utils/contracts.json'
import { postMember, postProject } from '../../utils/project'
import { putObject } from '../../utils/store'
import { RegistryCreatedEvent } from '../../utils/viem.types'
import { useAccountContext } from '../../wallet/AccountContext'

export interface CreateProjectStatus {
  founderPap?: PAP
  whoStatement: string
  selectedDetails?: SelectedDetails
  isCreating: boolean
  setFounderDetails: React.Dispatch<React.SetStateAction<DetailsAndPlatforms | undefined>>
  setWhoStatement: React.Dispatch<React.SetStateAction<string>>
  setDetails: React.Dispatch<React.SetStateAction<SelectedDetails | undefined>>
  createProject: () => void
  isSuccess: boolean
  isError: boolean
  error?: Error
  projectId?: number // projectId is used to signal the successful creation of the project.
}

export const useCreateProject = (): CreateProjectStatus => {
  const { t } = useTranslation()
  const { close } = useLoadingContext()
  const { show } = useToast()

  const {
    sendUserOps,
    aaAddress,
    isSuccess: isSuccessUserOp,
    events,
    reset,
    error: errorUserOp,
  } = useAccountContext()

  const { setSubtitle } = useLoadingContext()
  const publicClient = usePublicClient()

  const [founderDetails, setFounderDetails] = useState<DetailsAndPlatforms>()
  const [whoStatement, setWhoStatement] = useState<string>('')
  // const [whatStatement, setWhatStatement] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [selectedDetails, setDetails] = useState<SelectedDetails>()

  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [error, setError] = useState<Error>()

  const [projectId, setProjectId] = useState<number>()

  const founderPap: PAP | undefined = useMemo(() => {
    return aaAddress && founderDetails
      ? {
          account: aaAddress,
          person: founderDetails,
        }
      : undefined
  }, [aaAddress, founderDetails])

  const createProject = useCallback(async () => {
    if (!aaAddress || !founderPap || !sendUserOps) return

    setIsCreating(true)
    setIsError(false)
    setError(undefined)

    try {
      const founder = await putObject(founderPap)
      const statement = {
        whoStatement,
      }
      const statementEntity = await putObject({ statement })
      const salt = utils.keccak256(utils.toUtf8Bytes(Date.now().toString())) as HexStr

      // TODO weird encodedFunctionData asking for zero parameters
      const callData = encodeFunctionData({
        abi: registryFactoryABI,
        functionName: 'create',
        args: [
          'DEM',
          'microdemocracy ',
          [founderPap.account as HexStr],
          [founder.cid],
          statementEntity.cid,
          BigInt(PENDING_PERIOD),
          BigInt(VOTING_PERIOD),
          BigInt(QUIET_ENDING_PERIOD),
          salt,
        ],
      })

      const registryFactoryAddress = await getFactoryAddress()

      sendUserOps([
        {
          target: registryFactoryAddress,
          data: callData,
          value: BigInt(0),
        },
      ])
    } catch (e: any) {
      show({
        title: t([I18Keys.errorCreatingProject]),
        message: e.message,
        status: 'critical',
      })
      close()

      setIsCreating(false)
      setIsError(true)
      setError(e)
    }
  }, [aaAddress, sendUserOps, founderPap, whoStatement])

  useEffect(() => {
    if (errorUserOp) {
      setIsCreating(false)
      setError(errorUserOp)
      setIsError(true)
    }
  }, [errorUserOp])

  const registerProject = useCallback(
    async (event: RegistryCreatedEvent) => {
      if (!aaAddress) throw new Error('aaAddress not defined')

      const projectId = Number(event.args.number)
      const address = event.args.newRegistry as HexStr

      if (!selectedDetails) throw new Error('selectedDetails undefined')

      setSubtitle(t([I18Keys.registeringProject]))

      /** sign the "what" of the project */
      await postProject({
        projectId,
        address,
        whatStatement: '',
        whoStatement,
        selectedDetails,
      })

      /** get founder details */
      /** get the tokenId of the vouched address */
      const founderTokenId = publicClient
        ? await publicClient.readContract({
            address: address,
            abi: registryABI,
            args: [aaAddress],
            functionName: 'tokenIdOf',
          })
        : undefined

      const founderAccount =
        publicClient && founderTokenId
          ? await publicClient.readContract({
              address,
              abi: registryABI,
              args: [founderTokenId],
              functionName: 'getAccount',
            })
          : undefined

      if (!founderAccount) {
        throw new Error(`founder not found`)
      }

      await postMember({
        projectId,
        aaAddress,
        tokenId: Number(founderTokenId),
        voucherTokenId: Number(founderAccount.voucher),
      })

      setProjectId((event.args as any).number)
      setIsCreating(false)
    },
    [aaAddress, selectedDetails, whoStatement, publicClient],
  )

  useEffect(() => {
    if (isSuccessUserOp && events) {
      const event = events.find((e) => e.eventName === 'RegistryCreated') as
        | RegistryCreatedEvent
        | undefined
      if (event) {
        reset()
        registerProject(event)
        setIsSuccess(true)
      }
    }
  }, [isSuccessUserOp, events, registerProject])

  // reset is success automatically
  useEffect(() => {
    if (isSuccess) {
      setIsSuccess(false)
    }
  }, [isSuccess])

  return {
    founderPap,
    whoStatement,
    selectedDetails,
    isCreating,
    setFounderDetails,
    setWhoStatement,
    setDetails,
    createProject,
    isSuccess,
    isError,
    error,
    projectId,
  }
}
