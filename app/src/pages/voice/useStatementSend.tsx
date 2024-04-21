import { useEffect, useState } from 'react'

import { postStatement } from '../../utils/statements'
import { AppStatementCreate } from '../../types'
import { useProjectContext } from '../../contexts/ProjectContext'
import { useSemaphoreContext } from '../../contexts/SemaphoreContext'
import { hashMessage } from 'viem'
import { generateReactionProof, generateStatementProof } from './statement.utils'

export type VoiceSendContextType = {
  proposeStatement?: (statement: string) => Promise<boolean>
  isSuccessStatement: boolean
  statementId?: string
}

export const useStatementSend = (): VoiceSendContextType => {
  const { projectId, refetchStatements } = useProjectContext()
  const { identity } = useSemaphoreContext()

  const [isSuccessStatement, setIsSuccessStatement] = useState<boolean>(false)
  const [statementId, setStatementId] = useState<string>()

  const proposeStatement =
    identity !== undefined && projectId !== undefined
      ? async (_statement: string) => {
          setIsSuccessStatement(false)
          if (projectId) {
            const statementProofs = await generateStatementProof(
              _statement,
              projectId,
              identity,
            )

            const statement: AppStatementCreate = {
              projectId,
              statement: _statement,
              ...statementProofs,
            }

            const id = await postStatement(statement)

            if (id !== undefined) {
              refetchStatements()
              setIsSuccessStatement(true)
              setStatementId(id)
            }
            return id
          }
        }
      : undefined

  useEffect(() => {
    if (isSuccessStatement) {
      setIsSuccessStatement(false)
    }
  }, [isSuccessStatement])

  return {
    proposeStatement,
    isSuccessStatement,
    statementId,
  }
}
