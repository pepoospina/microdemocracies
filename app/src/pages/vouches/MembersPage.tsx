import { Box } from 'grommet'
import { Add, FormPrevious } from 'grommet-icons'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppContainer } from '../../components/app/AppContainer'
import { ViewportPage } from '../../components/app/Viewport'
import { useNavigateHelpers } from '../../components/app/navigate.helpers'
import { useProjectContext } from '../../contexts/ProjectContext'
import { I18Keys } from '../../i18n/kyel.list'
import { AppButton } from '../../ui-components'
import { AppBottomButton } from '../common/BottomButtons'
import { ApplicationCard } from './ApplicationCard'
import { MemberCard } from './MemberCard'

export const MembersPage = (): JSX.Element => {
  const { t, i18n } = useTranslation()
  const { members, applications, projectId } = useProjectContext()
  const { backToProject, navigate } = useNavigateHelpers()
  const { setTitle } = useAppContainer()

  useEffect(() => {
    setTitle({ prefix: t([I18Keys.listOf]), main: t([I18Keys.members]) })
  }, [i18n.language])

  return (
    <ViewportPage
      content={
        <Box pad="large">
          <AppButton
            margin={{ bottom: 'medium' }}
            primary
            icon={<Add />}
            label={t([I18Keys.invite])}
            onClick={() => navigate('../invite')}
          ></AppButton>

          {applications?.map((application, ix) => {
            return (
              <Box key={ix} style={{ marginBottom: '16px' }}>
                <ApplicationCard application={application}></ApplicationCard>
              </Box>
            )
          })}

          {members?.map((member, ix) => {
            return (
              <Box key={ix} style={{ marginBottom: '16px', flexShrink: 0 }}>
                <MemberCard member={member}></MemberCard>
              </Box>
            )
          })}
        </Box>
      }
      nav={
        <AppBottomButton
          icon={<FormPrevious />}
          label={t([I18Keys.projectHome])}
          onClick={() => backToProject(projectId)}
        ></AppBottomButton>
      }
    ></ViewportPage>
  )
}
