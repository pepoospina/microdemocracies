import { useQuery } from '@tanstack/react-query'
import { ReactNode, createContext, useContext, useEffect } from 'react'
import { useReadContract } from 'wagmi'

import { getTokenIdOfAddress } from '../firestore/getters'
import { AppAccount, AppChallenge } from '../shared/types'
import { registryABI } from '../utils/contracts.json'
import { useAccountContext } from '../wallet/AccountContext'
import { useMember } from './MemberContext'
import { useProjectContext } from './ProjectContext'
import { useToast } from './ToastsContext'

export type ConnectedMemberContextType = {
  tokenId?: number | null
  hasApplied?: boolean
  account?: AppAccount
  myChallenge: AppChallenge | undefined | null
}

const ConnectedMemberContextValue = createContext<ConnectedMemberContextType | undefined>(
  undefined,
)

export interface ConnectedMemberContextProps {
  children: ReactNode
}

export const ConnectedMemberContext = (props: ConnectedMemberContextProps) => {
  const { address: projectAddress } = useProjectContext()
  const { aaAddress } = useAccountContext()
  const { projectId } = useProjectContext()

  const {
    data: tokenId,
    isSuccess,
    error: errorWithTokenId,
  } = useQuery({
    queryKey: ['tokenId', projectId, aaAddress],
    queryFn: async () => {
      if (projectId && aaAddress) {
        const tokenId = await getTokenIdOfAddress(projectId, aaAddress)
        return tokenId ? tokenId : null
      }
      return null
    },
  })

  const { account: accountRead } = useMember({
    tokenId: tokenId ? Number(tokenId) : undefined,
  })

  const {
    data: _challengeRead,
    isError: isErrorChallengeRead,
    error: errorChallengeRead,
  } = useReadContract({
    address: projectAddress,
    abi: registryABI,
    functionName: 'getChallenge',
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: { enabled: tokenId !== undefined && projectAddress !== undefined },
  })

  const { show } = useToast()

  // useEffect(() => {
  //   if (errorChallengeRead) {
  //     show({ title: 'Error', message: errorChallengeRead.message })
  //   }
  // }, [errorChallengeRead])

  useEffect(() => {
    if (errorWithTokenId) {
      show({ title: 'Error', message: errorWithTokenId.message })
    }
  }, [errorWithTokenId])

  const myChallenge: AppChallenge | undefined | null = ((_challengeRead) => {
    if (
      isErrorChallengeRead &&
      errorChallengeRead &&
      errorChallengeRead.message.includes('')
    ) {
      return null
    }
    if (_challengeRead === undefined) {
      return undefined
    }
    if (_challengeRead[0] > 0 && !isErrorChallengeRead) {
      return {
        creationDate: Number(_challengeRead[0]),
        endDate: Number(_challengeRead[1]),
        lastOutcome: Number(_challengeRead[2]),
        nVoted: Number(_challengeRead[3]),
        nFor: Number(_challengeRead[4]),
        executed: _challengeRead[5],
      }
    }
  })(_challengeRead)

  const _tokenId = tokenId ? Number(tokenId) : isSuccess ? null : undefined

  return (
    <ConnectedMemberContextValue.Provider
      value={{
        tokenId: _tokenId,
        account: accountRead,
        myChallenge,
        hasApplied: false,
      }}
    >
      {props.children}
    </ConnectedMemberContextValue.Provider>
  )
}

export const useConnectedMember = (): ConnectedMemberContextType => {
  const context = useContext(ConnectedMemberContextValue)
  if (!context) throw Error('context not found')
  return context
}
