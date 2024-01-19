import { Box, Spinner, Text } from 'grommet';
import { useNavigate } from 'react-router-dom';

import { AppButton, AppCard, AppHeading } from '../../ui-components';
import { useProjectContext } from '../../contexts/ProjectContext';
import { Add, FormPrevious } from 'grommet-icons';
import { ViewportPage } from '../../components/app/Viewport';
import { Loading } from '../common/Loading';
import { ProjectCard } from './ProjectCard';
import { useVoiceRead } from '../../contexts/VoiceReadContext';
import { RouteNames } from '../../App';
import { useResponsive } from '../../components/app';
import { AppBottomButtons } from '../common/BottomButtons';
import { BoxCentered } from '../../ui-components/BoxCentered';
import { useConnectedMember } from '../../contexts/ConnectedAccountContext';
import { StatementCard } from '../voice/StatementCard';
import { useTranslation } from 'react-i18next';
import { cap } from '../../utils/general';

export interface IProjectHome {
  dum?: any;
}

export const ProjectHome = (props: IProjectHome) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { project, nMembers } = useProjectContext();
  const { tokenId } = useConnectedMember();
  const { statements } = useVoiceRead();
  const { mobile } = useResponsive();

  const newStr = mobile ? cap(t('propose')) : cap(t('proposeNew'));
  const membersStr = mobile ? cap(t('members')) : t('seeInviteMembers');

  if (project === undefined) {
    return (
      <BoxCentered fill>
        <Text>{t('loadingProject')}</Text>
        <Spinner></Spinner>
      </BoxCentered>
    );
  }

  if (project === null) {
    return (
      <BoxCentered fill>
        <AppCard>
          <Text>{t('projectNotFound')}</Text>
        </AppCard>
      </BoxCentered>
    );
  }

  const statementsContent = (() => {
    if (statements === undefined) return <Loading></Loading>;
    if (statements !== undefined && statements.length === 0) {
      return (
        <AppCard>
          <Text>{t('noStatements')}</Text>
        </AppCard>
      );
    }

    return statements.map((statement) => {
      return (
        <Box key={statement.id} style={{ marginBottom: '32px' }}>
          <StatementCard statement={statement} key={statement.id}></StatementCard>
        </Box>
      );
    });
  })();

  const content = (() => {
    return (
      <Box style={{ overflowY: 'auto' }} margin={{ bottom: 'medium' }}>
        <Box style={{ flexShrink: 0 }} pad={{ right: 'medium' }}>
          <Box margin={{ vertical: 'large' }}>
            <AppHeading level="3">{t('communityVoice')}:</AppHeading>
          </Box>
        </Box>
        <Box style={{ flexShrink: 0 }} pad={{ right: 'medium' }}>
          {statementsContent}
        </Box>
      </Box>
    );
  })();

  return (
    <ViewportPage>
      <Box pad="medium">
        <ProjectCard project={project}></ProjectCard>
      </Box>

      <Box pad={{ left: 'medium' }}>
        <Box pad={{ vertical: '16px', horizontal: 'medium' }} direction="row" align="center" justify="between">
          <AppHeading level="3">
            {cap(t('members'))}: {nMembers}
          </AppHeading>
          <AppButton onClick={() => navigate(RouteNames.Members)} label={membersStr}></AppButton>
        </Box>

        {tokenId === null ? (
          <Box pad="small">
            <AppButton onClick={() => navigate(RouteNames.Join)} label={'join'}></AppButton>
          </Box>
        ) : (
          <></>
        )}

        {content}
      </Box>

      <AppBottomButtons
        left={{
          action: () => navigate('/home'),
          label: t('back'),
          icon: <FormPrevious />,
        }}
        right={{
          primary: true,
          action: () => navigate('voice/propose'),
          icon: <Add></Add>,
          label: newStr,
        }}></AppBottomButtons>
    </ViewportPage>
  );
};
