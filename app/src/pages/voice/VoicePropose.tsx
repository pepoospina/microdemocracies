import { Box, Text } from 'grommet'
import { Add, FormPrevious } from 'grommet-icons'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { AppConnectButton } from '../../components/app/AppConnectButton'
import { useAppContainer } from '../../components/app/AppContainer'
import { ViewportPage } from '../../components/app/Viewport'
import { useNavigateHelpers } from '../../components/app/navigate.helpers'
import { MIN_LIKES_PUBLIC, MIN_MEMBERS } from '../../config/appConfig'
import { useLoadingContext } from '../../contexts/LoadingContext'
import { useProjectContext } from '../../contexts/ProjectContext'
import { useSemaphoreContext } from '../../contexts/SemaphoreContext'
import { useToast } from '../../contexts/ToastsContext'
import { i18n } from '../../i18n/i18n'
import { I18Keys } from '../../i18n/kyel.list'
import { RouteNames } from '../../route.names'
import { AppButton, AppCard, AppHeading } from '../../ui-components'
import { BoxCentered } from '../../ui-components/BoxCentered'
import { BulletList } from '../../ui-components/BulletList'
import { cap } from '../../utils/general'
import { AppBottomButtons } from '../common/BottomButtons'
import { Loading } from '../common/Loading'
import { StatementEditable } from './StatementEditable'
import { useStatementSend } from './useStatementSend'

export const VoicePropose = (): JSX.Element => {
  const { t } = useTranslation()

  const { isConnected } = useSemaphoreContext()
  const { proposeStatement, statementId } = useStatementSend()
  const { nMembers, projectId } = useProjectContext()

  const { publicId } = useSemaphoreContext()

  const [done, setDone] = useState<boolean>(false)
  const [isProposing, setIsProposing] = useState<boolean>(false)
  const { navigate, backToProject } = useNavigateHelpers()

  const { setTitle } = useAppContainer()

  const { show } = useToast()
  const { open, close } = useLoadingContext()

  useEffect(() => {
    setTitle({ prefix: cap(t([I18Keys.proposeNew])), main: t([I18Keys.statement]) })
  }, [i18n.language])

  const [input, setInput] = useState<string>()

  const _proposeStatement = async (input: string) => {
    if (proposeStatement) {
      open({ title: t([I18Keys.sendingProposal]), subtitle: t([I18Keys.preparingData]) })
      setIsProposing(true)

      proposeStatement(input)
        .then(() => {
          setIsProposing(false)
          close()
        })
        .catch((e) => {
          setIsProposing(false)
          close()
          show({
            title: t([I18Keys.errorGeneratingProof]),
            message: e.message,
            status: 'critical',
          })
        })
    }
  }

  useEffect(() => {
    if (statementId) {
      setDone(true)
      navigate(`../${RouteNames.VoiceStatement}/${statementId}`)
    }
  }, [statementId])

  const readyToPropose =
    isConnected && input && proposeStatement !== undefined && publicId && !done

  const content = (() => {
    if (nMembers === undefined) {
      return <Loading></Loading>
    }
    if (nMembers < MIN_MEMBERS) {
      return (
        <BoxCentered pad={{ horizontal: 'medium' }}>
          <AppCard margin={{ vertical: 'medium' }}>
            <Text>{t([I18Keys.atLeastNMembers], { nMembers: MIN_MEMBERS })}.</Text>
          </AppCard>
          <AppButton
            margin={{ bottom: 'medium' }}
            primary
            icon={<Add />}
            label={t([I18Keys.invite])}
            onClick={() => navigate('../../invite')}
          ></AppButton>
        </BoxCentered>
      )
    }
    return (
      <Box pad="large">
        {!done ? (
          <>
            <Box style={{ marginBottom: '36px' }}>
              <StatementEditable
                editable={!isProposing}
                onChanged={(value?: string) => {
                  if (value) setInput(value)
                }}
                placeholder={`${t([I18Keys.newStatement])}...`}
              ></StatementEditable>
            </Box>

            <AppHeading level="3" style={{ textAlign: 'center' }}>
              {t([I18Keys.important])}
            </AppHeading>

            <AppCard pad="small" margin={{ vertical: 'medium' }}>
              <BulletList
                elements={[
                  <Text>{t([I18Keys.canBackN], { nMembers })}.</Text>,
                  <Text>
                    {t([I18Keys.aStatementNeeds], { nLikes: MIN_LIKES_PUBLIC - 1 })}.
                  </Text>,
                  <Text>{t([I18Keys.maxStatementsPerPeriod])}.</Text>,
                ]}
              ></BulletList>
            </AppCard>

            <Box justify="center" style={{ margin: '36px 0', width: '100%' }}>
              {!isConnected ? (
                <AppConnectButton label={t([I18Keys.connectToPropose])}></AppConnectButton>
              ) : (
                <></>
              )}
            </Box>
          </>
        ) : (
          <AppCard>{t([I18Keys.statementProposed])}!</AppCard>
        )}
      </Box>
    )
  })()

  return (
    <ViewportPage
      content={content}
      nav={
        <AppBottomButtons
          left={{
            label: t([I18Keys.project]),
            icon: <FormPrevious></FormPrevious>,
            action: () => backToProject(projectId),
          }}
          right={{
            label: t([I18Keys.propose]),
            icon: <Add></Add>,
            action: () => {
              if (input) _proposeStatement(input)
            },
            disabled: !readyToPropose || isProposing,
            primary: true,
          }}
        ></AppBottomButtons>
      }
    ></ViewportPage>
  )
}
