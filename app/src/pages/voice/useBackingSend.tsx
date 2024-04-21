import { useEffect, useState } from 'react'

import { postBacking } from '../../utils/statements'
import { AppBackingCreate, StatementReactions } from '../../types'
import { generateReactionProof } from './statement.utils'
import { useSemaphoreContext } from '../../contexts/SemaphoreContext'

export type VoiceSendContextType = {
  backStatement?: (statementId: string, treeId: string) => Promise<any>
  isSuccessBacking: boolean
  isErrorBacking: boolean
  errorBacking?: string
}

export const useBackingSend = (): VoiceSendContextType => {
  const { identity } = useSemaphoreContext()
  const [isSuccessBacking, setIsSuccessBacking] = useState<boolean>(false)
  const [isErrorBacking, setIsErrorBacking] = useState<boolean>(false)
  const [errorBacking, setErrorBacking] = useState<string>()

  const backStatement = identity
    ? async (statementId: string, treeId: string) => {
        setIsSuccessBacking(false)
        setErrorBacking(undefined)

        const proofAndTree = await generateReactionProof(
          statementId,
          treeId,
          identity,
          StatementReactions.Back,
        )

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
