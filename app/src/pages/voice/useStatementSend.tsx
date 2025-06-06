import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { hashMessage } from 'viem'

import { useLoadingContext } from '../../contexts/LoadingContext'
import { useProjectContext } from '../../contexts/ProjectContext'
import { useSemaphoreContext } from '../../contexts/SemaphoreContext'
import { useToast } from '../../contexts/ToastsContext'
import { I18Keys } from '../../i18n/kyel.list'
import { AppStatementCreate } from '../../shared/types'
import { generateReactionProof, generateStatementProof } from '../../utils/statement.utils'
import { postStatement } from '../../utils/statements'

export type VoiceSendContextType = {
  proposeStatement?: (statement: string) => Promise<boolean>
  isSuccessStatement: boolean
  statementId?: string
}

export const useStatementSend = (): VoiceSendContextType => {
  const { t } = useTranslation()
  const { projectId, refetchStatements } = useProjectContext()
  const { identity } = useSemaphoreContext()
  const { show } = useToast()
  const { close } = useLoadingContext()

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

            const { id, error } = await postStatement(statement)

            if (id !== undefined) {
              refetchStatements()
              setIsSuccessStatement(true)
              setStatementId(id)
            } else {
              show({
                title: t([I18Keys.cannotPublishStatement]),
                message: error.includes('already posted')
                  ? t([I18Keys.cannotPublishStatementPeriod])
                  : error,
                status: 'critical',
                time: 5000,
              })
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
