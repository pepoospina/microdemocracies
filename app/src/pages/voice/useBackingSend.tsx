import { useEffect, useState } from 'react'

import { hashMessage } from 'viem'

import { useSemaphoreContext } from '../../contexts/SemaphoreContext'
import { AppBackingCreate, StatmentReactions as StatementReactions } from '../../types'
import { getSupportNullifier } from '../../utils/identity.utils'
import { postBacking } from '../../utils/statements'

export type VoiceSendContextType = {
  backStatement?: (statementId: string, treeId: string) => Promise<any>
  isSuccessBacking: boolean
  isErrorBacking: boolean
  errorBacking?: string
}

export const useBackingSend = (): VoiceSendContextType => {
  const { generateProof } = useSemaphoreContext()

  const [isSuccessBacking, setIsSuccessBacking] = useState<boolean>(false)
  const [isErrorBacking, setIsErrorBacking] = useState<boolean>(false)
  const [errorBacking, setErrorBacking] = useState<string>()

  const generateBackingProof =
    generateProof !== undefined
      ? async (statementId: string, treeId: string) => {
          return generateProof({
            signal: hashMessage(StatementReactions.Back),
            nullifier: getSupportNullifier(statementId),
            treeId,
          })
        }
      : undefined

  const backStatement = generateBackingProof
    ? async (statementId: string, treeId: string) => {
        setIsSuccessBacking(false)
        setErrorBacking(undefined)

        const proofAndTree = await generateBackingProof(statementId, treeId)

        const backing: AppBackingCreate = {
          statementId,
          proof: proofAndTree.proof,
        }

        const res = await postBacking(backing)

        if (res.success) {
          setIsSuccessBacking(true)
        } else {
          setIsErrorBacking(true)
          setErrorBacking(res.error)
        }
        return res
      }
    : undefined

  // reset automatically
  useEffect(() => {
    if (isSuccessBacking) {
      setIsSuccessBacking(false)
    }
  }, [isSuccessBacking])

  return {
    backStatement,
    isSuccessBacking,
    isErrorBacking,
    errorBacking,
  }
}
