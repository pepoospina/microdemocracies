import { Box, Text } from 'grommet';

import { AppBottomButton } from '../common/BottomButtons';
import { FormPrevious, Send, StatusGood } from 'grommet-icons';
import { ViewportPage } from '../../components/app/Viewport';
import { useProjectContext } from '../../contexts/ProjectContext';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { StatementCard } from './StatementCard';
import { useAppContainer } from '../../components/app/AppContainer';
import { useEffect } from 'react';
import { ProjectCard } from '../project/ProjectCard';
import { Loading } from '../common/Loading';
import { AppButton, AppCard } from '../../ui-components';
import { useStatementContext } from '../../contexts/StatementContext';
import { useCopyToClipboard } from '../../utils/copy.clipboard';

export const VoiceStatementPage = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { statementId } = useParams();
  const { project } = useProjectContext();
  const { setTitle } = useAppContainer();
  const { nBacking } = useStatementContext();

  const { copy, copied } = useCopyToClipboard();

  const share = () => {
    const link = window.location.href;
    if (navigator.share) {
      navigator.share({
        url: link,
        text: t('askSupport'),
      });
    } else {
      copy(link);
    }
  };

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
            <StatementCard></StatementCard>
          </Box>
          <Box margin={{ vertical: 'medium' }}>
            <Text margin={{ vertical: 'small' }}>For the microdemocracy:</Text>
            <ProjectCard project={project}></ProjectCard>
          </Box>
          {nBacking && nBacking < 2 ? (
            <Box>
              <AppCard>
                <Text>
                  This statement needs {2 - nBacking} more likes to appear in the microdemocracy home page. Share it
                  with others to get their support.
                </Text>
              </AppCard>
              <Box margin={{ vertical: 'medium' }}>
                <AppButton
                  onClick={() => share()}
                  icon={copied ? <StatusGood></StatusGood> : <Send></Send>}
                  reverse
                  primary
                  style={{ width: '100%' }}
                  label={copied ? 'link copied!' : 'share'}></AppButton>
              </Box>
            </Box>
          ) : (
            <></>
          )}
        </Box>
      }
      nav={
        <AppBottomButton label={t('back')} icon={<FormPrevious />} onClick={() => navigate(-1)}></AppBottomButton>
      }></ViewportPage>
  );
};
