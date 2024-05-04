import { Box, Text } from 'grommet'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { useThemeContext } from '../../components/app'
import { useMember } from '../../contexts/MemberContext'
import { I18Keys } from '../../i18n/kyel.list'
import { AbsoluteRoutes } from '../../route.names'
import { AppProjectMember } from '../../shared/types'
import { AppButton } from '../../ui-components'
import { LoadingDiv } from '../../ui-components/LoadingDiv'
import { getPapShortname } from '../../utils/pap'

export const MemberCard = (props: { member?: AppProjectMember }): JSX.Element => {
  const { constants } = useThemeContext()
  const { t } = useTranslation()
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { accountPap } = useMember({
    tokenId: props.member?.tokenId,
  })

  const member = props.member

  const goTo = () => {
    if (member && projectId) {
      navigate(AbsoluteRoutes.ProjectMember(projectId, member.tokenId.toString()))
    }
  }

  if (!member) {
    return <LoadingDiv></LoadingDiv>
  }

  return (
    <AppButton onClick={() => goTo()} style={{ textTransform: 'none' }}>
      <Box
        pad={{ vertical: 'medium', horizontal: 'medium' }}
        style={{
          backgroundColor: constants.colors.primary,
          color: constants.colors.textOnPrimary,
        }}
      >
        <Text>
          <b>
            {t([I18Keys.member])} #{props.member?.tokenId}
          </b>
        </Text>
        {!accountPap ? <LoadingDiv></LoadingDiv> : getPapShortname(accountPap.object)}
      </Box>
    </AppButton>
  )
}
