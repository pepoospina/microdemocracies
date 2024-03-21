import { Box, Text } from 'grommet'
import { useEffect, useState } from 'react'

import { AppButton, AppCard, AppHeading } from '../../ui-components'
import { AppConnectButton } from '../../components/app/AppConnectButton'
import { useNavigate } from 'react-router-dom'
import { AppBottomButtons } from '../common/BottomButtons'
import { Add, FormPrevious } from 'grommet-icons'
import { useAccountContext } from '../../wallet/AccountContext'
import { StatementEditable } from './StatementEditable'
import { useSemaphoreContext } from '../../contexts/SemaphoreContext'
import { Loading } from '../common/Loading'
import { ViewportPage } from '../../components/app/Viewport'
import { useStatementSend } from './useStatementSend'
import { useTranslation } from 'react-i18next'
import { useAppContainer } from '../../components/app/AppContainer'
import { i18n } from '../../i18n/i18n'
import { cap } from '../../utils/general'
import { RouteNames } from '../../route.names'
import { useProjectContext } from '../../contexts/ProjectContext'
import { BoxCentered } from '../../ui-components/BoxCentered'
import { MIN_LIKES_PUBLIC, MIN_MEMBERS } from '../../config/appConfig'
import { BulletList } from '../../ui-components/BulletList'

export const VoicePropose = (): JSX.Element => {
  const { t } = useTranslation()
  const { isConnected } = useAccountContext()
  const { proposeStatement, statementId } = useStatementSend()
  const { nMembers } = useProjectContext()

  const { publicId } = useSemaphoreContext()

  const [done, setDone] = useState<boolean>(false)
  const [isProposing, setIsProposing] = useState<boolean>(false)
  const navigate = useNavigate()

  const { setTitle } = useAppContainer()

  useEffect(() => {
    setTitle({ prefix: cap(t('proposeNew')), main: t('statement') })
  }, [i18n.language])

  const [input, setInput] = useState<string>()

  const _proposeStatement = async (input: string) => {
    if (proposeStatement) {
      setIsProposing(true)
      proposeStatement(input).then(() => {})
    }
  }

  useEffect(() => {
    if (statementId) {
      setIsProposing(false)
      setDone(true)
      navigate(`../${RouteNames.VoiceStatement}/${statementId}`)
    }
  }, [statementId])

  const readyToPropose = isConnected && input && proposeStatement !== undefined && publicId && !done

  const content = (() => {
    if (nMembers === undefined) {
      return <Loading></Loading>
    }
    if (nMembers < 3) {
      return (
        <BoxCentered pad={{ horizontal: 'medium' }}>
          <AppCard margin={{ vertical: 'medium' }}>
            <Text>{t('atLeastNMembers', { nMembers: MIN_MEMBERS })}.</Text>
          </AppCard>
          <AppButton
            margin={{ bottom: 'medium' }}
            primary
            icon={<Add />}
            label={t('invite')}
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
                placeholder={`${t('newStatement')}...`}
              ></StatementEditable>
            </Box>

            <AppHeading level="3" style={{ textAlign: 'center' }}>
              {t('important')}
            </AppHeading>

            <AppCard pad="small" margin={{ vertical: 'medium' }}>
              <BulletList
                elements={[
                  <Text>{t('canBackN', { nMembers })}.</Text>,
                  <Text>{t('aStatementNeeds', { nLikes: MIN_LIKES_PUBLIC })}.</Text>,
                  <Text>{t('youNeedToLike')}.</Text>,
                ]}
              ></BulletList>
            </AppCard>

            <Box justify="center" style={{ margin: '36px 0', width: '100%' }}>
              {!isConnected ? <AppConnectButton label={t('connectToPropose')}></AppConnectButton> : <></>}
              {isProposing ? (
                <Box>
                  <Loading label={t('sendingProposal')}></Loading>
                </Box>
              ) : (
                <></>
              )}
            </Box>
          </>
        ) : (
          <AppCard>{t('statementProposed')}!</AppCard>
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
            label: t('back'),
            icon: <FormPrevious></FormPrevious>,
            action: () => navigate(-1),
          }}
          right={{
            label: t('propose'),
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
