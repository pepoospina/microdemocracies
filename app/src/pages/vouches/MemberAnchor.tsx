import { Anchor } from 'grommet';
import { useTranslation } from 'react-i18next';
import { useConnectedMember } from '../../contexts/ConnectedAccountContext';
import { useMember } from '../../contexts/MemberContext';
import { LoadingDiv } from '../../ui-components/LoadingDiv';
import { getPapShortname } from '../../utils/pap';
import { useNavigate, useParams } from 'react-router-dom';
import { RouteNames } from '../../App';

export const MemberAnchor = (props: { tokenId: number }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { tokenId } = props;
  const { tokenId: connectedTokenId } = useConnectedMember();

  const isLoggedMember = tokenId && connectedTokenId ? tokenId === connectedTokenId : false;

  const { accountPap: memberPap } = useMember({ tokenId });

  if (!memberPap) {
    return <LoadingDiv></LoadingDiv>;
  }

  const tag = getPapShortname(memberPap.object);

  const goToMemberPage = () => {
    if (projectId) {
      navigate(`${RouteNames.ProjectHome(projectId)}/${RouteNames.Member(tokenId)}`);
    }
  };

  return (
    <Anchor style={{ marginRight: '5px' }} onClick={() => goToMemberPage()}>
      {tag}
      {isLoggedMember ? ` (${t('you')})` : ''}
    </Anchor>
  );
};
