import { Box, Spinner, Text } from 'grommet';
import { AppApplication } from '../../types';
import { AppButton, AppCard, AppCircleButton } from '../../ui-components';
import { useNavigate, useParams } from 'react-router-dom';
import { RouteNames } from '../../route.names';
import { getPapShortname } from '../../utils/pap';
import { Trash } from 'grommet-icons';
import { postDeleteApplication } from '../../utils/project';
import { useProjectContext } from '../../contexts/ProjectContext';
import { useTranslation } from 'react-i18next';

export const ApplicationCard = (props: { application?: AppApplication }): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { refetchApplications } = useProjectContext();

  const { application } = props;

  const clicked = () => {
    if (application) {
      navigate(`/p/${projectId}/${RouteNames.Invite}/${application?.papEntity.cid}`);
    }
  };

  const remove = () => {
    if (application) {
      postDeleteApplication(application.papEntity.object.account).then(() => {
        refetchApplications();
      });
    }
  };

  const label = getPapShortname(application?.papEntity.object);

  return (
    <AppCard style={{ padding: '0px' }}>
      {application ? (
        <Box fill direction="row" align="center" justify="between">
          <AppButton
            plain
            style={{ textTransform: 'none', padding: '16px 24px', flexGrow: 1 }}
            onClick={() => clicked()}>
            <Text>{t('pendingApplicationBy', { by: label })}</Text>
          </AppButton>

          <AppButton
            plain
            style={{ textTransform: 'none', padding: '16px 24px', flexGrow: 0 }}
            onClick={() => remove()}>
            <Trash size="20px"></Trash>
          </AppButton>
        </Box>
      ) : (
        <Box fill align="center" justify="center">
          <Spinner></Spinner>
        </Box>
      )}
    </AppCard>
  );
};
