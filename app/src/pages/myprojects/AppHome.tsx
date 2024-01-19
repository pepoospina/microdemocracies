import { Box, Button, Text } from 'grommet';
import { AppCard, AppHeading } from '../../ui-components';
import { ViewportPage } from '../../components/app/Viewport';
import { Add } from 'grommet-icons';
import { useAccountContext } from '../../wallet/AccountContext';
import { useAccountDataContext } from '../../wallet/AccountDataContext';
import { Loading } from '../common/Loading';
import { ProjectCard } from '../project/ProjectCard';
import { useNavigate } from 'react-router-dom';
import { AppBottomButton } from '../common/BottomButtons';
import { useTranslation } from 'react-i18next';
import { ConnectedUser } from '../../components/app/ConnectedUser';

export const AppHome = (props: {}) => {
  const { isConnected } = useAccountContext();

  const { projects } = useAccountDataContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const projectClicked = (projectId: number) => {
    navigate(`/p/${projectId}`);
  };

  const projectsContent = (() => {
    if (!isConnected) return <></>;
    if (projects === undefined) return <Loading label={t('loadingProjects')}></Loading>;
    if (projects.length === 0)
      return (
        <AppCard>
          <Text>{t('noProjects')}</Text>
        </AppCard>
      );
    return (
      <Box>
        <AppHeading level="2" style={{ marginBottom: '16px' }}>
          {t('yourProjects')}
        </AppHeading>
        {projects.map((project, ix) => {
          return (
            <Box key={ix} style={{ position: 'relative', marginBottom: '16px', flexShrink: 0 }}>
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
      <Box fill pad={{ horizontal: 'large' }}>
        <Box style={{ flexShrink: 0 }}>{projectsContent}</Box>
      </Box>

      <AppBottomButton onClick={() => navigate('/start')} icon={<Add></Add>} label={t('startNew')}></AppBottomButton>
    </ViewportPage>
  );
};
