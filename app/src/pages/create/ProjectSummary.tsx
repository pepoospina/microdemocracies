import { Box } from 'grommet';
import { StatementEditable } from '../voice/StatementEditable';
import { DetailsSelectedSummary } from './DetailsSelectedSummary';
import { AppHeading } from '../../ui-components';
import { PAP, SelectedDetails } from '../../types';
import { AccountPerson } from '../account/AccountPerson';

export const ProjectSummary = (props: {
  whatStatement?: string;
  whoStatement?: string;
  selectedDetails?: SelectedDetails;
  founderPap?: PAP;
}) => {
  return (
    <Box pad="large">
      <Box style={{ width: '100%', flexShrink: 0 }}>
        <Box style={{ marginBottom: '12px', fontSize: '10px', fontWeight: '300', flexShrink: 0 }}>
          <AppHeading level="3">What:</AppHeading>
        </Box>
        <Box>
          <StatementEditable value={props.whatStatement}></StatementEditable>
        </Box>

        <Box style={{ margin: '36px 0 12px 0', fontSize: '10px', fontWeight: '300', flexShrink: 0 }}>
          <AppHeading level="3">Who:</AppHeading>
        </Box>
        <Box>
          <StatementEditable value={props.whoStatement}></StatementEditable>
        </Box>
      </Box>

      <Box style={{ marginTop: '36px', flexShrink: 0 }}>
        <AppHeading level="3">Particinats will be asked to provide:</AppHeading>
        <DetailsSelectedSummary selected={props.selectedDetails}></DetailsSelectedSummary>
      </Box>

      <Box style={{ marginTop: '36px', flexShrink: 0 }}>
        <AppHeading level="3">Your Details:</AppHeading>
        <AccountPerson pap={props.founderPap}></AccountPerson>
      </Box>
    </Box>
  );
};
