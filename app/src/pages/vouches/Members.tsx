import { Box } from 'grommet'
import { Add, FormPrevious } from 'grommet-icons'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useAppContainer } from '../../components/app/AppContainer'
import { ViewportPage } from '../../components/app/Viewport'
import { useProjectContext } from '../../contexts/ProjectContext'
import { AbsoluteRoutes } from '../../route.names'
import { AppButton } from '../../ui-components'
import { AppBottomButton } from '../common/BottomButtons'
import { ApplicationCard } from './ApplicationCard'
import { MemberCard } from './MemberCard'

export const MembersPage = (): JSX.Element => {
  const { t, i18n } = useTranslation()
  const { members, applications, projectId } = useProjectContext()
  const navigate = useNavigate()
  const { setTitle } = useAppContainer()

  useEffect(() => {
    setTitle({ prefix: t('listOf'), main: t('members') })
  }, [i18n.language])

  return (
    <ViewportPage
      content={
        <Box pad="large">
          <AppButton
            margin={{ bottom: 'medium' }}
            primary
            icon={<Add />}
            label={t('invite')}
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
          label={t('back')}
          onClick={() => navigate(AbsoluteRoutes.ProjectHome(projectId?.toString() as string))}
        ></AppBottomButton>
      }
    ></ViewportPage>
  )
}
