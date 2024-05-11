import { Box, Text } from 'grommet'
import { FormPrevious, Send, StatusGood } from 'grommet-icons'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { useAppContainer } from '../../components/app/AppContainer'
import { ViewportPage } from '../../components/app/Viewport'
import { useNavigateHelpers } from '../../components/app/navigate.helpers'
import { MIN_LIKES_PUBLIC } from '../../config/appConfig'
import { useProjectContext } from '../../contexts/ProjectContext'
import { useStatementContext } from '../../contexts/StatementContext'
import { I18Keys } from '../../i18n/kyel.list'
import { AbsoluteRoutes } from '../../route.names'
import { AppButton, AppCard, AppHeading } from '../../ui-components'
import { useCopyToClipboard } from '../../utils/copy.clipboard'
import { AppBottomButton, AppBottomButtons } from '../common/BottomButtons'
import { Loading } from '../common/Loading'
import { ProjectCard } from '../project/ProjectCard'
import { StatementCard } from './StatementCard'

export const VoiceStatementPage = (): JSX.Element => {
  const { t } = useTranslation()
  const { backToProject, navigate } = useNavigateHelpers()

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
        text: t([I18Keys.askSupport]),
      })
    } else {
      copy(link)
    }
  }

  useEffect(() => {
    setTitle({ prefix: t([I18Keys.project]), main: t([I18Keys.statement]) })
  }, [])

  if (!project || !statementId) {
    return <Loading></Loading>
  }

  const nBackingDef = nBacking !== undefined ? nBacking : 0
  const isShown = nBackingDef !== undefined && nBackingDef >= MIN_LIKES_PUBLIC

  return (
    <ViewportPage
      content={
        <Box pad="medium">
          <Box>
            <Text margin={{ vertical: 'small' }}>
              {t(I18Keys.theFollowingStatementProposed)}
            </Text>
            <StatementCard></StatementCard>
          </Box>
          <Box margin={{ vertical: 'medium' }}>
            <Text margin={{ vertical: 'small' }}>{t(I18Keys.forTheProject)}:</Text>
            <ProjectCard project={project}></ProjectCard>
          </Box>

          <Box>
            <Box margin={{ top: 'large' }}>
              <AppHeading level="3" style={{ textAlign: 'center' }}>
                {!isShown
                  ? t([I18Keys.likesNeeded], { nLikes: MIN_LIKES_PUBLIC - nBackingDef })
                  : t([I18Keys.noLikesNeeded])}
              </AppHeading>
              {!isShown ? (
                <Box>
                  <AppCard margin={{ vertical: 'large' }}>
                    <Text>
                      {t([I18Keys.likesNeededDetailed], {
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
        <AppBottomButton
          onClick={() => backToProject(projectId)}
          label={t([I18Keys.projectHome])}
          icon={<FormPrevious></FormPrevious>}
        ></AppBottomButton>
      }
    ></ViewportPage>
  )
}
