import { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import { Box, Button, Text } from 'grommet'
import { Add } from 'grommet-icons'

import { AppConnectButton } from '../../components/app/AppConnectButton'
import { useAppContainer } from '../../components/app/AppContainer'
import { ViewportPage } from '../../components/app/Viewport'
import { useSemaphoreContext } from '../../contexts/SemaphoreContext'
import { AppCard } from '../../ui-components'
import { useAccountContext } from '../../wallet/AccountContext'
import { useAccountDataContext } from '../../wallet/AccountDataContext'
import { AppBottomButton } from '../common/BottomButtons'
import { Loading } from '../common/Loading'
import { ProjectCard } from '../project/ProjectCard'

import { useTranslation } from 'react-i18next'

export const AppHome = (props: {}) => {
  const { aaAddress } = useAccountContext()
  const { isConnected } = useSemaphoreContext()
  const { setTitle } = useAppContainer()

  const { projects } = useAccountDataContext()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    setTitle({ prefix: t('your'), main: t('appName') })
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
    if (projects === undefined) return <Loading label={t('loadingProjects')}></Loading>
    if (projects.length === 0)
      return (
        <Box pad="medium">
          <AppCard>
            <Text>{t('noProjects')}</Text>
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
          onClick={() => navigate('/start')}
          icon={<Add></Add>}
          label={t('startNew')}
        ></AppBottomButton>
      }
    ></ViewportPage>
  )
}
