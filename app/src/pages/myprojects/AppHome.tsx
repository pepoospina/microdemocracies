import { Box, Button, Text } from 'grommet';
import { AppCard } from '../../ui-components';
import { ViewportPage } from '../../components/app/Viewport';
import { Add } from 'grommet-icons';
import { useAccountContext } from '../../wallet/AccountContext';
import { useAccountDataContext } from '../../wallet/AccountDataContext';
import { Loading } from '../common/Loading';
import { ProjectCard } from '../project/ProjectCard';
import { useNavigate } from 'react-router-dom';
import { AppBottomButton } from '../common/BottomButtons';
import { useTranslation } from 'react-i18next';
import { useAppContainer } from '../../components/app/AppContainer';
import { useEffect } from 'react';
import { AppConnectButton } from '../../components/app/AppConnectButton';

export const AppHome = (props: {}) => {
  const { isConnected, aaAddress } = useAccountContext();
  const { setTitle } = useAppContainer();

  const { projects } = useAccountDataContext();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setTitle({ prefix: t('your'), main: t('appName') });
  }, [i18n.language]);

  const projectClicked = (projectId: number) => {
    navigate(`/p/${projectId}`);
  };

  const projectsContent = (() => {
    if (!isConnected)
      return (
        <Box pad="large">
          <AppCard margin={{ bottom: 'large' }}>
            <Text>Please sign in to see your microdemocracies</Text>
          </AppCard>
          <AppConnectButton></AppConnectButton>
        </Box>
      );
    if (!aaAddress) {
      return <Loading></Loading>;
    }
    if (projects === undefined) return <Loading label={t('loadingProjects')}></Loading>;
    if (projects.length === 0)
      return (
        <AppCard>
          <Text>{t('noProjects')}</Text>
        </AppCard>
      );
    return (
      <Box pad={{ horizontal: 'medium' }}>
        {projects.map((project, ix) => {
          return (
            <Box key={ix} margin={{ top: 'medium' }} style={{ position: 'relative', flexShrink: 0 }}>
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
    <ViewportPage
      content={projectsContent}
      nav={
        <AppBottomButton onClick={() => navigate('/start')} icon={<Add></Add>} label={t('startNew')}></AppBottomButton>
      }></ViewportPage>
  );
};
