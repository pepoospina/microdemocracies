import { Anchor, Box, Spinner, Text } from 'grommet';
import { useNavigate } from 'react-router-dom';

import { AppCard, AppHeading } from '../../ui-components';
import { useProjectContext } from '../../contexts/ProjectContext';
import { Add, FormPrevious } from 'grommet-icons';
import { ViewportPage } from '../../components/styles/LayoutComponents.styled';
import { Loading } from '../common/WaitingTransaction';
import { ProjectCard } from './ProjecCard';
import { useVoiceRead } from '../../contexts/VoiceReadContext';
import { StatementEditable } from '../voice/StatementEditable';
import { RouteNames } from '../../App';
import { useResponsive } from '../../components/app';
import { AppBottomButtons } from '../common/BottomButtons';
import { BoxCentered } from '../../ui-components/BoxCentered';

export interface IProjectHome {
  dum?: any;
}

export const ProjectHome = (props: IProjectHome) => {
  const navigate = useNavigate();
  const { project, nMembers } = useProjectContext();
  const { statements } = useVoiceRead();
  const { mobile } = useResponsive();

  const newStr = mobile ? 'propose' : 'Propose new';

  if (project === undefined) {
    return (
      <BoxCentered fill>
        <Text>Loading micro(r)evolution details</Text>
        <Spinner></Spinner>
      </BoxCentered>
    );
  }

  const statementsContent = (() => {
    if (statements === undefined) return <Loading></Loading>;
    if (statements !== undefined && statements.length === 0) {
      return (
        <AppCard>
          <Text>Nothing has been said yet</Text>
        </AppCard>
      );
    }

    return statements.map((statement) => {
      return (
        <Box key={statement.id} style={{ marginBottom: '16px' }}>
          <StatementEditable value={statement.statement} key={statement.id}></StatementEditable>
        </Box>
      );
    });
  })();

  const content = (() => {
    return (
      <Box style={{ overflowY: 'auto' }} margin={{ bottom: 'medium' }}>
        <Box style={{ flexShrink: 0 }} pad={{ right: 'large' }}>
          <ProjectCard project={project}></ProjectCard>

          <Box margin={{ vertical: 'large' }}>
            <AppHeading level="3">Community's voice:</AppHeading>
            <Text>
              From <Anchor onClick={() => navigate(RouteNames.Members)}>{nMembers} members</Anchor>
            </Text>
          </Box>
        </Box>
        <Box style={{ flexShrink: 0 }} pad={{ right: 'large' }}>
          {statementsContent}
        </Box>
      </Box>
    );
  })();

  return (
    <ViewportPage>
      <Box pad={{ horizontal: 'large' }} align="center" justify="center" fill style={{ flexShrink: '0' }}>
        <Text size="22px" weight="bold">
          A micro(r)evolution for:
        </Text>
      </Box>
      <Box pad={{ left: 'large' }}>{content}</Box>
      <AppBottomButtons
        left={{
          action: () => navigate('/home'),
          label: 'back',
          icon: <FormPrevious />,
        }}
        right={{
          action: () => navigate('voice/propose'),
          icon: <Add></Add>,
          label: newStr,
        }}></AppBottomButtons>
    </ViewportPage>
  );
};
