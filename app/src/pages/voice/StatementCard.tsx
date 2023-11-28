import { Box } from 'grommet';
import { AppStatement } from '../../types';

import { StatementEditable } from './StatementEditable';
import { ReactNode } from 'react';
import { Like } from 'grommet-icons';
import { BoxCentered } from '../../ui-components/BoxCentered';

const CircleButton = (props: { icon: ReactNode }) => {
  return <Box>{props.icon}</Box>;
};

export const StatementCard = (props: { statement: AppStatement; containerStyle?: React.CSSProperties }) => {
  return (
    <Box style={{ position: 'relative', flexShrink: 0, ...props.containerStyle }}>
      <StatementEditable value={props.statement.statement}></StatementEditable>
      <BoxCentered
        style={{
          position: 'absolute',
          bottom: '-12px',
          right: '10px',
          height: '42px',
          width: '42px',
          backgroundColor: 'white',
          border: '2px solid black',
          borderRadius: '50%',
        }}>
        <CircleButton icon={<Like style={{ height: '20px' }} />}></CircleButton>
      </BoxCentered>
    </Box>
  );
};
