import { useEffect, useState } from 'react'

import { Box } from 'grommet'

import { useConnect } from 'wagmi'

import { useProjectContext } from '../contexts/ProjectContext'
import { StatementContext } from '../contexts/StatementContext'
import { StatementCard } from '../pages/voice/StatementCard'
import { useBackingSend } from '../pages/voice/useBackingSend'
import { useStatementSend } from '../pages/voice/useStatementSend'
import { AppButton, AppHeading } from '../ui-components'
import { BoxCentered } from '../ui-components/BoxCentered'
import { useAccountContext } from '../wallet/AccountContext'
import { useAppSigner } from '../wallet/SignerContext'

export const TestProject = () => {
  const { connect } = useAppSigner()
  const { isConnected } = useAccountContext()
  const { projectId, statements } = useProjectContext()
  const { proposeStatement, isSuccessStatement } = useStatementSend()
  const { backStatement } = useBackingSend()

  const [random, setRandom] = useState<string>()

  const startTest = async () => {
    if (!proposeStatement) {
      throw new Error('unexpected')
    }

    console.log('[TEST] proposing statement')
    const _random = Date.now().toString()

    setRandom(_random)
    proposeStatement(`Test statement ${_random}`)
  }

  /** project created ? post a statement */
  useEffect(() => {
    if (isSuccessStatement) {
      console.log('[TEST] statement proposed')
    }
  }, [isSuccessStatement])

  /** statement posted => post backing */
  const runBackStatement = async () => {
    if (random && statements) {
      const found = statements.find((s) => s.statement.includes(random))
      if (found && backStatement) {
        console.log('[TEST] statement found', { found })
        const res = await backStatement(found.id, found.treeId)
        console.log('backing posted', res)

        /** try again */

        const res2 = await backStatement(found.id, found.treeId)
        if (res2.success) {
          console.error('request succeded')
        }
      }
    }
  }

  useEffect(() => {
    runBackStatement()
  }, [statements, random])

  return (
    <BoxCentered fill gap="large">
      <AppHeading level="3">Project {projectId}</AppHeading>
      {!isConnected ? (
        <AppButton onClick={() => connect()} label="Connect" primary></AppButton>
      ) : (
        <></>
      )}
      <AppButton
        disabled={proposeStatement === undefined}
        onClick={() => startTest()}
        label="Start Test"
        primary
      ></AppButton>

      <Box style={{ overflowY: 'auto' }} pad="medium">
        {statements ? (
          statements.map((statement, ix) => {
            return (
              <StatementContext statement={statement}>
                <StatementCard
                  containerStyle={{ marginBottom: '22px' }}
                  key={ix}
                ></StatementCard>
              </StatementContext>
            )
          })
        ) : (
          <></>
        )}
      </Box>
    </BoxCentered>
  )
}
