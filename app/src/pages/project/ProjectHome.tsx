import { Box, DropButton, Spinner, Text } from 'grommet'
import { Add, FormPrevious, Group, Menu, UserAdd } from 'grommet-icons'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useResponsive, useThemeContext } from '../../components/app'
import { useAppContainer } from '../../components/app/AppContainer'
import { CircleIndicator } from '../../components/app/CircleIndicator'
import { ViewportPage } from '../../components/app/Viewport'
import { CHAIN_ID } from '../../config/appConfig'
import { useConnectedMember } from '../../contexts/ConnectedAccountContext'
import { useLoadingContext } from '../../contexts/LoadingContext'
import { useProjectContext } from '../../contexts/ProjectContext'
import { StatementContext } from '../../contexts/StatementContext'
import { AbsoluteRoutes, RouteNames } from '../../route.names'
import { Address, AppButton, AppCard, AppHeading } from '../../ui-components'
import { BoxCentered } from '../../ui-components/BoxCentered'
import { cap } from '../../utils/general'
import { AppBottomButtons } from '../common/BottomButtons'
import { Loading } from '../common/Loading'
import { StatementCard } from '../voice/StatementCard'
import { ProjectCard } from './ProjectCard'

export interface IProjectHome {
  dum?: any
}

export const ProjectHomePage = (props: IProjectHome) => {
  const { t, i18n } = useTranslation()
  const { setSubtitle, setLoading } = useLoadingContext()
  const navigate = useNavigate()
  const { project, nMembers, statements } = useProjectContext()
  const { tokenId } = useConnectedMember()
  const { mobile } = useResponsive()
  const { setTitle } = useAppContainer()
  const { constants } = useThemeContext()

  const leave = () => {
    console.log('soon')
  }

  useEffect(() => {
    setTitle({ prefix: '', main: t('project') })
  }, [i18n.language])

  const newStr = mobile ? cap(t('propose')) : cap(t('proposeNew'))

  useEffect(() => {
    if (!project) {
      setSubtitle(t('loadingProject'))
    } else {
      /** finally close the project create modal if it was on */
      setLoading(false)
    }
  }, [project])

  if (project === undefined) {
    return (
      <BoxCentered fill>
        <Text>{t('loadingProject')}</Text>
        <Spinner></Spinner>
      </BoxCentered>
    )
  }

  if (project === null) {
    return (
      <BoxCentered fill>
        <AppCard>
          <Text>{t('projectNotFound')}</Text>
        </AppCard>
      </BoxCentered>
    )
  }

  const goToStatement = (id: string) => {
    navigate(`${RouteNames.VoiceBase}/${RouteNames.VoiceStatement}/${id}`)
  }

  const statementsContent = (() => {
    if (statements === undefined) return <Loading></Loading>
    if (statements !== undefined && statements.length === 0) {
      return (
        <AppCard>
          <Text>{t('noStatements')}</Text>
        </AppCard>
      )
    }

    return statements.map((statement) => {
      return (
        <Box key={statement.id} style={{ marginBottom: '32px' }}>
          <StatementContext statement={statement}>
            <StatementCard
              key={statement.id}
              onClick={() => goToStatement(statement.id)}
            ></StatementCard>
          </StatementContext>
        </Box>
      )
    })
  })()

  const content = (() => {
    return (
      <Box
        style={{ overflowY: 'auto' }}
        margin={{ bottom: 'medium' }}
        pad={{ left: 'medium' }}
      >
        <Box style={{ flexShrink: 0 }} pad={{ right: 'medium' }}>
          <Box margin={{ vertical: 'large' }}>
            <AppHeading level="3">{t('communityVoice')}:</AppHeading>
          </Box>
        </Box>
        <Box style={{ flexShrink: 0 }} pad={{ right: 'medium' }}>
          {statementsContent}
        </Box>
      </Box>
    )
  })()

  return (
    <ViewportPage
      content={
        <Box>
          <Box pad={{ horizontal: 'medium' }}>
            <Box style={{ position: 'relative', flexShrink: 0 }}>
              <ProjectCard
                project={project}
                statementStyle={{ paddingBottom: '28px' }}
              ></ProjectCard>
              <Box
                direction="row"
                justify="end"
                align="center"
                gap="small"
                pad={{ horizontal: 'medium' }}
                style={{
                  position: 'absolute',
                  bottom: '-12px',
                  left: '0px',
                  width: '100%',
                }}
              >
                <AppButton plain onClick={() => navigate(RouteNames.Members)}>
                  <CircleIndicator
                    forceCircle={false}
                    size={48}
                    icon={
                      <>
                        <Group color={constants.colors.textOnPrimary}></Group>
                        <Text
                          color={constants.colors.textOnPrimary}
                          style={{ fontWeight: 'bold' }}
                          margin={{ left: 'small' }}
                        >
                          ({nMembers})
                        </Text>
                      </>
                    }
                  ></CircleIndicator>
                </AppButton>
                <AppButton
                  plain
                  disabled={tokenId === undefined}
                  onClick={() => navigate(RouteNames.Invite)}
                >
                  <CircleIndicator
                    forceCircle={true}
                    size={54}
                    icon={
                      <UserAdd
                        color={constants.colors.textOnPrimary}
                        style={{ marginLeft: '5px' }}
                      ></UserAdd>
                    }
                  ></CircleIndicator>
                </AppButton>
                <DropButton
                  dropProps={{ style: { marginTop: '56px' } }}
                  dropContent={
                    <Box pad="20px" gap="small">
                      <Box margin={{ bottom: 'small' }}>
                        <Text>{cap(t('projectAddress'))}</Text>
                        <Address
                          addressType="token"
                          address={project?.address}
                          chainId={CHAIN_ID}
                        ></Address>
                      </Box>

                      <AppButton
                        disabled
                        plain
                        onClick={() => leave()}
                        style={{ textTransform: 'none', paddingTop: '6px' }}
                      >
                        <Text style={{ fontWeight: 'bold' }}>{cap(t('leave'))}</Text>
                      </AppButton>
                    </Box>
                  }
                >
                  <CircleIndicator
                    forceCircle={true}
                    size={54}
                    icon={<Menu color={constants.colors.textOnPrimary} style={{}}></Menu>}
                  ></CircleIndicator>
                </DropButton>
              </Box>
            </Box>
          </Box>

          <Box>
            {tokenId === null ? (
              <Box pad={{ horizontal: 'medium' }} margin={{ top: 'medium' }}>
                <AppButton
                  onClick={() => navigate(RouteNames.Join)}
                  label={'join'}
                ></AppButton>
              </Box>
            ) : (
              <></>
            )}

            {content}
          </Box>
        </Box>
      }
      nav={
        <AppBottomButtons
          left={{
            action: () => navigate(AbsoluteRoutes.Projects),
            label: t('appHome'),
            icon: <FormPrevious />,
          }}
          right={{
            primary: true,
            action: () => navigate(`${RouteNames.VoiceBase}/${RouteNames.VoicePropose}`),
            icon: <Add></Add>,
            label: newStr,
          }}
        ></AppBottomButtons>
      }
    ></ViewportPage>
  )
}
