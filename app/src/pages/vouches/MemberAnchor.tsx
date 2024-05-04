import { Anchor, AnchorExtendedProps } from 'grommet'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { useConnectedMember } from '../../contexts/ConnectedAccountContext'
import { useMember } from '../../contexts/MemberContext'
import { I18Keys } from '../../i18n/kyel.list'
import { AbsoluteRoutes } from '../../route.names'
import { LoadingDiv } from '../../ui-components/LoadingDiv'
import { getPapShortname } from '../../utils/pap'

export const MemberAnchor = (props: { tokenId: number } & AnchorExtendedProps) => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { tokenId } = props
  const { tokenId: connectedTokenId } = useConnectedMember()

  const isLoggedMember = tokenId && connectedTokenId ? tokenId === connectedTokenId : false

  const { accountPap: memberPap } = useMember({ tokenId })

  if (!memberPap) {
    return <LoadingDiv></LoadingDiv>
  }

  const tag = getPapShortname(memberPap.object)

  const goToMemberPage = () => {
    if (projectId) {
      navigate(AbsoluteRoutes.ProjectMember(projectId, tokenId.toString()))
    }
  }

  return (
    <Anchor style={{ marginRight: '5px', ...props.style }} onClick={() => goToMemberPage()}>
      {tag}
      {isLoggedMember ? ` (${t([I18Keys.you])})` : ''}
    </Anchor>
  )
}
