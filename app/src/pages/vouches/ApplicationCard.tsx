import { Box, Spinner, Text } from 'grommet'
import { Trash } from 'grommet-icons'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { useProjectContext } from '../../contexts/ProjectContext'
import { I18Keys } from '../../i18n/kyel.list'
import { RouteNames } from '../../route.names'
import { AppApplication } from '../../shared/types'
import { AppButton, AppCard, AppCircleButton } from '../../ui-components'
import { getPapShortname } from '../../utils/pap'
import { postDeleteApplication } from '../../utils/project'

export const ApplicationCard = (props: { application?: AppApplication }): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { projectId, refetchApplications } = useProjectContext()

  const { application } = props

  const clicked = () => {
    if (application) {
      navigate(`/p/${projectId}/${RouteNames.Invite}/${application?.papEntity.cid}`)
    }
  }

  const remove = () => {
    if (application && projectId) {
      postDeleteApplication(projectId, application.papEntity.object.account).then(() => {
        refetchApplications()
      })
    }
  }

  const label = getPapShortname(application?.papEntity.object)

  return (
    <AppCard style={{ padding: '0px' }}>
      {application ? (
        <Box fill direction="row" align="center" justify="between">
          <AppButton
            plain
            style={{ textTransform: 'none', padding: '16px 24px', flexGrow: 1 }}
            onClick={() => clicked()}
          >
            <Text>{t([I18Keys.pendingApplicationBy], { by: label })}</Text>
          </AppButton>

          <AppButton
            plain
            style={{ textTransform: 'none', padding: '16px 24px', flexGrow: 0 }}
            onClick={() => remove()}
          >
            <Trash size="20px"></Trash>
          </AppButton>
        </Box>
      ) : (
        <Box fill align="center" justify="center">
          <Spinner></Spinner>
        </Box>
      )}
    </AppCard>
  )
}
