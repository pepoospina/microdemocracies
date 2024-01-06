import { Box, Spinner, Text } from 'grommet';
import { AppApplication } from '../../types';
import { AppButton, AppCard } from '../../ui-components';
import { useNavigate, useParams } from 'react-router-dom';
import { RouteNames } from '../../App';

export const ApplicationCard = (props: { application?: AppApplication }): JSX.Element => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { application } = props;

  const clicked = () => {
    if (application) {
      navigate(`/p/${projectId}/${RouteNames.Invite}/${application?.papEntity.cid}`);
    }
  };

  return (
    <AppButton onClick={() => clicked()} style={{ textTransform: 'none' }}>
      <AppCard>
        {application ? (
          <Box fill>
            <Text>Pending application by {application.papEntity.object.person.personal?.firstName}</Text>
          </Box>
        ) : (
          <Box fill align="center" justify="center">
            <Spinner></Spinner>
          </Box>
        )}
      </AppCard>
    </AppButton>
  );
};
