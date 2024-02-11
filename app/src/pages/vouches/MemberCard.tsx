import { Box, Spinner, Text } from 'grommet';
import { AppProjectMember } from '../../types';
import { AppButton, AppCard } from '../../ui-components';
import { useNavigate, useParams } from 'react-router-dom';

import { AbsoluteRoutes } from '../../route.names';
import { useTranslation } from 'react-i18next';
import { MemberAnchor } from './MemberAnchor';
import { LoadingDiv } from '../../ui-components/LoadingDiv';

export const MemberCard = (props: { member?: AppProjectMember }): JSX.Element => {
  const { projectId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const member = props.member;

  const goTo = () => {
    if (member && projectId) {
      navigate(AbsoluteRoutes.ProjectMember(projectId, '0'));
    }
  };

  if (!member) {
    return <LoadingDiv></LoadingDiv>;
  }

  return (
    <AppButton onClick={() => goTo()} style={{ textTransform: 'none' }}>
      <AppCard>{member.aaAddress}</AppCard>
    </AppButton>
  );
};
