import { Box, Spinner, Text } from 'grommet';
import { Add } from 'grommet-icons';

import { AppCard } from '../../ui-components';
import { AppScreen, BottomButtons } from '../../ui-components/AppFormScreen';
import { useNavigate } from 'react-router-dom';
import { useVoiceRead } from '../../contexts/VoiceReadContext';
import { StatementEditable } from './StatementEditable';
import { useProjectContext } from '../../contexts/ProjectContext';

export const VoicePage = (): JSX.Element => {
  const { statements } = useVoiceRead();
  const { goHome } = useProjectContext();
  const navigate = useNavigate();

  return (
    <AppScreen label="Community Voice">
      <Box>
        <Box pad="large">
          {statements !== undefined ? (
            statements.map((statement) => {
              return <StatementEditable value={statement.object.statement} key={statement.id}></StatementEditable>;
            })
          ) : (
            <Box fill align="center" justify="center">
              <Spinner></Spinner>
            </Box>
          )}
          {statements !== undefined && statements.length === 0 ? (
            <AppCard>
              <Text>No statements found</Text>
            </AppCard>
          ) : (
            <></>
          )}
        </Box>
      </Box>
      <BottomButtons
        left={{ label: 'home', primary: false, action: goHome }}
        right={{
          icon: <Add />,
          label: 'propose new',
          primary: true,
          action: () => navigate('propose'),
        }}></BottomButtons>
    </AppScreen>
  );
};
