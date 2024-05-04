import { Box, Button, Text } from 'grommet'
import { Add } from 'grommet-icons'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { AppConnectButton } from '../../components/app/AppConnectButton'
import { useAppContainer } from '../../components/app/AppContainer'
import { ViewportPage } from '../../components/app/Viewport'
import { useSemaphoreContext } from '../../contexts/SemaphoreContext'
import { I18Keys } from '../../i18n/kyel.list'
import { AbsoluteRoutes } from '../../route.names'
import { AppCard } from '../../ui-components'
import { useAccountContext } from '../../wallet/AccountContext'
import { useAccountDataContext } from '../../wallet/AccountDataContext'
import { AppBottomButton } from '../common/BottomButtons'
import { Loading } from '../common/Loading'
import { ProjectCard } from '../project/ProjectCard'

export const AppHome = (props: {}) => {
  const { aaAddress } = useAccountContext()
  const { isConnected } = useSemaphoreContext()
  const { setTitle } = useAppContainer()

  const { projects } = useAccountDataContext()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    setTitle({ prefix: t([I18Keys.your]), main: t([I18Keys.appName]) })
  }, [i18n.language])

  const projectClicked = (projectId: number) => {
    navigate(`/p/${projectId}`)
  }

  const projectsContent = (() => {
    if (!isConnected)
      return (
        <Box pad="large">
          <AppCard margin={{ bottom: 'large' }}>
            <Text>Please sign in to see your microdemocracies</Text>
          </AppCard>
          <AppConnectButton></AppConnectButton>
        </Box>
      )
    if (!aaAddress) {
      return <Loading></Loading>
    }
    if (projects === undefined)
      return <Loading label={t([I18Keys.loadingProjects])}></Loading>
    if (projects.length === 0)
      return (
        <Box pad="medium">
          <AppCard>
            <Text>{t([I18Keys.noProjects])}</Text>
          </AppCard>
        </Box>
      )
    return (
      <Box pad={{ horizontal: 'medium' }}>
        {projects.map((project, ix) => {
          return (
            <Box
              key={ix}
              margin={{ top: 'medium' }}
              style={{ position: 'relative', flexShrink: 0 }}
            >
              <ProjectCard project={project}></ProjectCard>
              <Button
                onClick={() => projectClicked(project.projectId)}
                plain
                style={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                }}
              ></Button>
            </Box>
          )
        })}
      </Box>
    )
  })()

  return (
    <ViewportPage
      content={projectsContent}
      nav={
        <AppBottomButton
          onClick={() => navigate(AbsoluteRoutes.Start)}
          icon={<Add></Add>}
          label={t([I18Keys.startNew])}
        ></AppBottomButton>
      }
    ></ViewportPage>
  )
}
