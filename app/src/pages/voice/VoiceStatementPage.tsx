import { Box, Text } from 'grommet'
import { FormPrevious, Send, StatusGood } from 'grommet-icons'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { useAppContainer } from '../../components/app/AppContainer'
import { ViewportPage } from '../../components/app/Viewport'
import { MIN_LIKES_PUBLIC } from '../../config/appConfig'
import { useProjectContext } from '../../contexts/ProjectContext'
import { useStatementContext } from '../../contexts/StatementContext'
import { AbsoluteRoutes } from '../../route.names'
import { AppButton, AppCard, AppHeading } from '../../ui-components'
import { useCopyToClipboard } from '../../utils/copy.clipboard'
import { AppBottomButtons } from '../common/BottomButtons'
import { Loading } from '../common/Loading'
import { ProjectCard } from '../project/ProjectCard'
import { StatementCard } from './StatementCard'

export const VoiceStatementPage = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { statementId } = useParams()
  const { project, projectId } = useProjectContext()
  const { setTitle } = useAppContainer()
  const { nBacking } = useStatementContext()

  const { copy, copied } = useCopyToClipboard()

  const share = () => {
    const link = window.location.href
    if (navigator.share) {
      navigator.share({
        url: link,
        text: t('askSupport'),
      })
    } else {
      copy(link)
    }
  }

  useEffect(() => {
    setTitle({ prefix: t('project'), main: t('statement') })
  }, [])

  if (!project || !statementId) {
    return <Loading></Loading>
  }

  const nBackingDef = nBacking !== undefined ? nBacking : 0
  const isShown = nBackingDef !== undefined && nBackingDef >= 2
  console.log({ nBackingDef, isShown })

  return (
    <ViewportPage
      content={
        <Box pad="medium">
          <Box>
            <Text margin={{ vertical: 'small' }}>The following statement was proposed</Text>
            <StatementCard></StatementCard>
          </Box>
          <Box margin={{ vertical: 'medium' }}>
            <Text margin={{ vertical: 'small' }}>For the microdemocracy:</Text>
            <ProjectCard project={project}></ProjectCard>
          </Box>

          <Box>
            <Box margin={{ top: 'large' }}>
              <AppHeading level="3" style={{ textAlign: 'center' }}>
                {!isShown
                  ? t('likesNeeded', { nLikes: MIN_LIKES_PUBLIC - nBackingDef })
                  : t('noLikesNeeded')}
              </AppHeading>
              {!isShown ? (
                <Box>
                  <AppCard margin={{ vertical: 'large' }}>
                    <Text>
                      {t('likesNeededDetailed', {
                        nLikes: MIN_LIKES_PUBLIC - (nBacking ? nBacking : 0),
                      })}
                    </Text>
                  </AppCard>
                  <Box>
                    <AppButton
                      onClick={() => share()}
                      icon={copied ? <StatusGood></StatusGood> : <Send></Send>}
                      reverse
                      primary
                      style={{ width: '100%' }}
                      label={copied ? 'link copied!' : 'share'}
                    ></AppButton>
                  </Box>
                </Box>
              ) : (
                <></>
              )}
            </Box>
          </Box>
        </Box>
      }
      nav={
        <AppBottomButtons
          left={{
            action: () => navigate(-1),
            label: t('back'),
            icon: <FormPrevious />,
          }}
          right={{
            primary: true,
            action: () =>
              navigate(`${AbsoluteRoutes.ProjectHome(projectId?.toString() as string)}`),
            label: t('finish'),
          }}
        ></AppBottomButtons>
      }
    ></ViewportPage>
  )
}
