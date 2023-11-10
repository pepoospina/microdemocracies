import { Box } from 'grommet';
import { PAP } from '../../types';
import { AccountPerson } from '../account/AccountPerson';

export interface IPAPEntry {
  pap?: PAP;
}

export const PAPEntry = (props: IPAPEntry) => {
  if (!props.pap) return <></>;
  return (
    <Box style={{ width: '100%' }} pad="medium">
      <AccountPerson pap={props.pap}></AccountPerson>
    </Box>
  );
};
