import { Box, Text } from 'grommet';
import { AppProject } from '../../types';
import { StatementEditable } from '../voice/StatementEditable';
import { Bold } from '../landing/LandingPage';

export const ProjectCard = (props: { project: AppProject; containerStyle?: React.CSSProperties }) => {
  return (
    <Box style={{ position: 'relative', ...props.containerStyle }}>
      <Box style={{ position: 'absolute', left: '12px', top: '4px' }}>
        <Text color="#919191" style={{ fontSize: '14px' }}>
          Anyone <Bold>who</Bold>:
        </Text>
      </Box>
      <StatementEditable value={props.project.whoStatement} containerStyle={{ paddingTop: '22px' }}></StatementEditable>
    </Box>
  );
};
