import { Anchor, Box, Text } from 'grommet';
import { useNavigate } from 'react-router-dom';

import { AppButton, AppCard, AppHeading } from '../../ui-components';
import { useProjectContext } from '../../contexts/ProjectContext';
import { Add, FormPrevious } from 'grommet-icons';
import { ViewportPage } from '../../components/styles/LayoutComponents.styled';
import { Loading } from '../common/WaitingTransaction';
import { ProjectCard } from './ProjecCard';
import { useVoiceRead } from '../../contexts/VoiceReadContext';
import { StatementEditable } from '../voice/StatementEditable';
import { RouteNames } from '../../App';

export interface IProjectHome {
  dum?: any;
}

export const ProjectHome = (props: IProjectHome) => {
  const navigate = useNavigate();
  const { project, nMembers } = useProjectContext();
  const { statements } = useVoiceRead();

  if (project === undefined) {
    return (
      <Box>
        <Loading></Loading>
      </Box>
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
      <Box style={{ overflowY: 'auto' }}>
        <Box style={{ flexShrink: 0 }} pad={{ right: 'large' }}>
          <ProjectCard project={project}></ProjectCard>

          <Box margin={{ vertical: 'large' }}>
            <AppHeading level="3">Community's voice:</AppHeading>
            <Text>
              From <Anchor onClick={() => navigate(RouteNames.Members)}>{nMembers} members</Anchor>
            </Text>
          </Box>
        </Box>
        <Box style={{ flexShrink: 0 }} pad={{ right: 'large', bottom: 'large' }}>
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
      <Box direction="row">
        <AppButton onClick={() => navigate('/home')} label="back" icon={<FormPrevious />}></AppButton>
        <AppButton onClick={() => navigate('voice/propose')} icon={<Add></Add>} label="Propose new"></AppButton>
      </Box>
    </ViewportPage>
  );
};
