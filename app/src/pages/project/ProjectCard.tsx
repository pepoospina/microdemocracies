import { Box, Text } from 'grommet';
import { AppProject } from '../../types';
import { StatementEditable } from '../voice/StatementEditable';
import { Trans } from 'react-i18next';
import { Bold } from '../../ui-components/Bold';

export const ProjectCard = (props: {
  project: AppProject;
  containerStyle?: React.CSSProperties;
  statementStyle?: React.CSSProperties;
}) => {
  return (
    <Box style={{ position: 'relative', ...props.containerStyle }}>
      <Box style={{ position: 'absolute', left: '12px', top: '4px' }}>
        <Text color="#919191" style={{ fontSize: '14px' }}>
          <Trans i18nKey={'anyoneWho'} components={{ Bold: <Bold></Bold> }}></Trans>:
        </Text>
      </Box>
      <StatementEditable
        value={props.project.whoStatement}
        containerStyle={{ paddingTop: '22px', ...props.statementStyle }}></StatementEditable>
    </Box>
  );
};
