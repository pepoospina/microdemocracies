import { Box, Button, Text } from 'grommet';
import { AppButton, AppCard } from '../../ui-components';
import { ViewportHeadingSmall, ViewportPage } from '../../components/app/Viewport';
import { appName } from '../../config/community';
import { Add } from 'grommet-icons';
import { useAccountContext } from '../../wallet/AccountContext';
import { AppConnect } from '../../components/app/AppConnect';
import { useAccountDataContext } from '../../wallet/AccountDataContext';
import { Loading } from '../common/WaitingTransaction';
import { ProjectCard } from '../project/ProjecCard';
import { useNavigate } from 'react-router-dom';
import { BoxCentered } from '../../ui-components/BoxCentered';

export const AppHome = (props: {}) => {
  const { isConnected } = useAccountContext();
  const { projects } = useAccountDataContext();
  const navigate = useNavigate();

  const projectClicked = (projectId: number) => {
    navigate(`/p/${projectId}`);
  };

  const content = (() => {
    if (!isConnected)
      return (
        <BoxCentered fill>
          <AppConnect></AppConnect>
        </BoxCentered>
      );
    if (projects === undefined) return <Loading label="Loading projects"></Loading>;
    if (projects.length === 0)
      return (
        <AppCard>
          <Text>Your have not joined or started any micro(r)evolution yet.</Text>
        </AppCard>
      );
    return (
      <Box>
        {projects.map((project, ix) => {
          return (
            <Box key={ix} style={{ position: 'relative', marginBottom: '16px' }}>
              <ProjectCard project={project}></ProjectCard>
              <Button
                onClick={() => projectClicked(project.projectId)}
                plain
                style={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                }}></Button>
            </Box>
          );
        })}
      </Box>
    );
  })();

  return (
    <ViewportPage>
      <ViewportHeadingSmall label={`Your micro(r)evolutions:`}></ViewportHeadingSmall>

      <Box fill pad={{ horizontal: 'large' }}>
        {content}
      </Box>

      <Box>
        <AppButton onClick={() => navigate('/start')} icon={<Add></Add>} label="Start new"></AppButton>
      </Box>
    </ViewportPage>
  );
};
