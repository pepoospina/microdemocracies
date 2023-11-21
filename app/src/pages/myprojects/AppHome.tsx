import { Box, Button, Text } from 'grommet';
import { AppButton } from '../../ui-components';
import { ViewportPage } from '../../components/styles/LayoutComponents.styled';
import { appName } from '../../config/community';
import { Add } from 'grommet-icons';
import { useAccountContext } from '../../wallet/AccountContext';
import { AppConnect } from '../../components/app/AppConnect';
import { useAccountDataContext } from '../../wallet/AccountDataContext';
import { Loading } from '../common/WaitingTransaction';
import { ProjectCard } from '../project/ProjecCard';
import { useNavigate } from 'react-router-dom';

export const AppHome = (props: {}) => {
  const { isConnected } = useAccountContext();
  const { projects } = useAccountDataContext();
  const navigate = useNavigate();

  console.log({ projects });

  const projectClicked = (projectId: number) => {
    navigate(`/p/${projectId}`);
  };

  const content = (() => {
    if (!isConnected) return <AppConnect></AppConnect>;
    if (projects === undefined) return <Loading label="Loading projects"></Loading>;

    return (
      <Box>
        {projects.map((project) => {
          return (
            <Box style={{ position: 'relative', marginBottom: '16px' }}>
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
      <Box justify="center" align="center" fill>
        <Text size="22px" weight="bold">
          Your {appName}:
        </Text>
      </Box>
      <Box justify="center" pad={{ horizontal: 'large' }}>
        {content}
      </Box>
      <Box>
        <AppButton onClick={() => navigate('/start')} icon={<Add></Add>} label="Start new"></AppButton>
      </Box>
    </ViewportPage>
  );
};
