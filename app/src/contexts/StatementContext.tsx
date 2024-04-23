import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useState } from 'react'

import { countStatementBackings, getStatement } from '../firestore/getters'
import { useBackingSend } from '../pages/voice/useBackingSend'
import { StatementRead } from '../types'
import { useConnectedMember } from './ConnectedAccountContext'
import { useProjectContext } from './ProjectContext'

export type StatementContextType = {
  statement?: StatementRead
  nBacking?: number
  canBack: boolean
  back: () => void
  isBacking: boolean
  alreadyBacked?: boolean
}

interface IStatementContext {
  statement?: StatementRead
  statementId?: string
  children: React.ReactNode
}

const StatementContextValue = createContext<StatementContextType | undefined>(undefined)

export const StatementContext = (props: IStatementContext) => {
  const { statement: propsStatement, statementId: propsStatementId } = props

  if (!propsStatement && !propsStatementId) {
    throw new Error('Either statement or statementId must be provided.')
  }

  const statementId = propsStatement ? propsStatement.id : (propsStatementId as string)

  const { tokenId } = useConnectedMember()
  const [isBacking, setIsBacking] = useState<boolean>(false)
  const [alreadyBacked, setAlreadyBacked] = useState<boolean>()
  const { refetchStatements } = useProjectContext()

  const { data: statementRead } = useQuery({
    queryKey: [`${propsStatementId}`],
    queryFn: async () => {
      if (propsStatementId) {
        return getStatement(statementId)
      }
    },
  })

  const statement = propsStatement ? propsStatement : statementRead

  const {
    data: nBacking,
    isLoading,
    refetch: refetchCount,
  } = useQuery({
    queryKey: ['statementBackers', statement?.id],
    queryFn: () => {
      if (statement) {
        return countStatementBackings(statement.id)
      }
    },
  })

  const { backStatement, isSuccessBacking, errorBacking } = useBackingSend()

  const canBack = tokenId !== undefined && tokenId !== null

  const back = () => {
    if (backStatement && statement) {
      setIsBacking(true)
      backStatement(statement.id, statement.treeId)
    }
  }

  useEffect(() => {
    if (isSuccessBacking) {
      setIsBacking(false)
      refetchCount()
      refetchStatements()
    }
  }, [isSuccessBacking])

  useEffect(() => {
    if (errorBacking) {
      setIsBacking(false)
      if (errorBacking.toLocaleLowerCase().includes('already posted')) {
        setAlreadyBacked(true)
      }
    }
  }, [errorBacking])

  useEffect(() => {
    if (alreadyBacked) {
      setTimeout(() => {
        setAlreadyBacked(false)
      }, 3000)
    }
  }, [alreadyBacked])

  return (
    <StatementContextValue.Provider
      value={{
        statement,
        canBack,
        nBacking,
        back,
        isBacking,
        alreadyBacked,
      }}
    >
      {props.children}
    </StatementContextValue.Provider>
  )
}

export const useStatementContext = (): StatementContextType => {
  const context = useContext(StatementContextValue)
  if (!context) throw Error('context not found')
  return context
}
