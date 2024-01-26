import { Box, Text } from 'grommet';

import { AppBottomButton } from '../common/BottomButtons';
import { FormPrevious } from 'grommet-icons';
import { ViewportPage } from '../../components/app/Viewport';
import { useProjectContext } from '../../contexts/ProjectContext';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { StatementCard } from './StatementCard';
import { useAppContainer } from '../../components/app/AppContainer';
import { useEffect } from 'react';
import { ProjectCard } from '../project/ProjectCard';
import { Loading } from '../common/Loading';

export const VoiceStatementPage = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { statementId } = useParams();
  const { project } = useProjectContext();
  const { setTitle } = useAppContainer();

  useEffect(() => {
    setTitle({ prefix: t('project'), main: t('statement') });
  }, []);

  if (!project || !statementId) {
    return <Loading></Loading>;
  }

  return (
    <ViewportPage
      content={
        <Box pad="medium">
          <Box>
            <Text margin={{ vertical: 'small' }}>The following statement was proposed</Text>
            <StatementCard statementId={statementId}></StatementCard>
          </Box>
          <Box margin={{ vertical: 'large' }}>
            <Text margin={{ vertical: 'small' }}>For the microdemocracy:</Text>
            <ProjectCard project={project}></ProjectCard>
          </Box>
        </Box>
      }
      nav={
        <AppBottomButton label={t('back')} icon={<FormPrevious />} onClick={() => navigate(-1)}></AppBottomButton>
      }></ViewportPage>
  );
};
