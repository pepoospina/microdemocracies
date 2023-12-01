import { Box, Button, Text } from 'grommet';
import { AppCard } from '../../ui-components';
import { ViewportHeadingSmall, ViewportPage } from '../../components/app/Viewport';
import { Add } from 'grommet-icons';
import { useAccountContext } from '../../wallet/AccountContext';
import { AppConnect } from '../../components/app/AppConnect';
import { useAccountDataContext } from '../../wallet/AccountDataContext';
import { Loading } from '../common/WaitingTransaction';
import { ProjectCard } from '../project/ProjectCard';
import { useNavigate } from 'react-router-dom';
import { BoxCentered } from '../../ui-components/BoxCentered';
import { AppBottomButton } from '../common/BottomButtons';
import { useTranslation } from 'react-i18next';

export const AppHome = (props: {}) => {
  const { isConnected } = useAccountContext();
  const { projects } = useAccountDataContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
          <Text>{t('noProjects')}</Text>
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
      <ViewportHeadingSmall label={`${t('yourProjects')}:`}></ViewportHeadingSmall>

      <Box fill pad={{ horizontal: 'large' }}>
        {content}
      </Box>

      <AppBottomButton onClick={() => navigate('/start')} icon={<Add></Add>} label={t('startNew')}></AppBottomButton>
    </ViewportPage>
  );
};
