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
import { AppButton, AppCard, AppHeading } from '../../ui-components';
import { useStatementContext } from '../../contexts/StatementContext';
import { useCopyToClipboard } from '../../utils/copy.clipboard';
import { MIN_LIKES_PUBLIC } from '../../config/appConfig';

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

  const nBackingDef = nBacking !== undefined ? nBacking : 0;
  const isShown = nBackingDef !== undefined && nBackingDef >= 2;

  return (
    <ViewportPage
      content={
        <Box pad="medium">
          <Box>
            {!isShown ? (
              <Box margin={{ top: 'large', bottom: '48px' }}>
                <AppHeading level="3" style={{ textAlign: 'center' }}>
                  {t('likesNeeded', { nLikes: MIN_LIKES_PUBLIC - nBackingDef })}
                </AppHeading>

                <Box>
                  <AppCard margin={{ vertical: 'large' }}>
                    <Text>{t('likesNeededDetailed', { nLikes: MIN_LIKES_PUBLIC - (nBacking ? nBacking : 0) })}</Text>
                  </AppCard>
                  <Box>
                    <AppButton
                      onClick={() => share()}
                      icon={copied ? <StatusGood></StatusGood> : <Send></Send>}
                      reverse
                      primary
                      style={{ width: '100%' }}
                      label={copied ? 'link copied!' : 'share'}></AppButton>
                  </Box>
                </Box>
              </Box>
            ) : (
              <></>
            )}
          </Box>
          <Box>
            <Text margin={{ vertical: 'small' }}>The following statement was proposed</Text>
            <StatementCard></StatementCard>
          </Box>
          <Box margin={{ vertical: 'medium', bottom: '64px' }}>
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
