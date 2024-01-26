import { Box, Spinner, Text } from 'grommet';
import { useNavigate } from 'react-router-dom';

import { AppButton, AppCard, AppHeading } from '../../ui-components';
import { useProjectContext } from '../../contexts/ProjectContext';
import { Add, FormPrevious, Group, UserAdd } from 'grommet-icons';
import { ViewportPage } from '../../components/app/Viewport';
import { Loading } from '../common/Loading';
import { ProjectCard } from './ProjectCard';
import { AbsoluteRoutes, RouteNames } from '../../route.names';
import { useResponsive, useThemeContext } from '../../components/app';
import { AppBottomButtons } from '../common/BottomButtons';
import { BoxCentered } from '../../ui-components/BoxCentered';
import { useConnectedMember } from '../../contexts/ConnectedAccountContext';
import { StatementCard } from '../voice/StatementCard';
import { useTranslation } from 'react-i18next';
import { cap } from '../../utils/general';
import { useEffect } from 'react';
import { useAppContainer } from '../../components/app/AppContainer';
import { CircleIndicator } from '../../components/app/CircleIndicator';
import { StatementContext } from '../../contexts/StatementContext';

export interface IProjectHome {
  dum?: any;
}

export const ProjectHomePage = (props: IProjectHome) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { project, nMembers, statements } = useProjectContext();
  const { tokenId } = useConnectedMember();
  const { mobile } = useResponsive();
  const { setTitle } = useAppContainer();
  const { constants } = useThemeContext();

  useEffect(() => {
    setTitle({ prefix: '', main: t('project') });
  }, [i18n.language]);

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

  const goToStatement = (id: string) => {
    navigate(`${RouteNames.VoiceBase}/${RouteNames.VoiceStatement}/${id}`);
  };

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
          <StatementContext statement={statement}>
            <StatementCard
              key={statement.id}
              statmentCardProps={{ onClick: () => goToStatement(statement.id) }}></StatementCard>
          </StatementContext>
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
    <ViewportPage
      content={
        <Box>
          <Box pad={{ horizontal: 'medium' }}>
            <Box style={{ position: 'relative', flexShrink: 0 }}>
              <ProjectCard project={project} statementStyle={{ paddingBottom: '28px' }}></ProjectCard>
              <Box
                direction="row"
                justify="end"
                align="center"
                gap="small"
                pad={{ horizontal: 'medium' }}
                style={{ position: 'absolute', bottom: '-12px', left: '0px', width: '100%' }}>
                <AppButton plain onClick={() => navigate(RouteNames.Members)}>
                  <CircleIndicator
                    forceCircle={false}
                    size={48}
                    icon={
                      <>
                        <Group color={constants.colors.textOnPrimary}></Group>
                        <Text
                          color={constants.colors.textOnPrimary}
                          style={{ fontWeight: 'bold' }}
                          margin={{ left: 'small' }}>
                          ({nMembers})
                        </Text>
                      </>
                    }></CircleIndicator>
                </AppButton>
                <AppButton plain onClick={() => navigate(RouteNames.Invite)}>
                  <CircleIndicator
                    forceCircle={true}
                    size={54}
                    icon={
                      <UserAdd color={constants.colors.textOnPrimary} style={{ marginLeft: '5px' }}></UserAdd>
                    }></CircleIndicator>
                </AppButton>
              </Box>
            </Box>
          </Box>

          <Box pad={{ left: 'medium' }}>
            {tokenId === null ? (
              <Box pad="small">
                <AppButton onClick={() => navigate(RouteNames.Join)} label={'join'}></AppButton>
              </Box>
            ) : (
              <></>
            )}

            {content}
          </Box>
        </Box>
      }
      nav={
        <AppBottomButtons
          left={{
            action: () => navigate(AbsoluteRoutes.Projects),
            label: t('back'),
            icon: <FormPrevious />,
          }}
          right={{
            primary: true,
            action: () => navigate(`${RouteNames.VoiceBase}/${RouteNames.VoicePropose}`),
            icon: <Add></Add>,
            label: newStr,
          }}></AppBottomButtons>
      }></ViewportPage>
  );
};
