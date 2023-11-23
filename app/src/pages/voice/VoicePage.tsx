import { Box, Spinner, Text } from 'grommet';
import { Add } from 'grommet-icons';

import { AppCard } from '../../ui-components';
import { AppScreen } from '../../ui-components/AppFormScreen';
import { useNavigate } from 'react-router-dom';
import { useVoiceRead } from '../../contexts/VoiceReadContext';
import { StatementEditable } from './StatementEditable';
import { AppBottomButtons } from '../common/BottomButtons';

export const VoicePage = (): JSX.Element => {
  const { statements } = useVoiceRead();
  const navigate = useNavigate();

  return (
    <AppScreen label="Community Voice">
      <Box>
        <Box pad="large">
          {statements !== undefined ? (
            statements.map((statement) => {
              return (
                <Box style={{ marginBottom: '16px' }}>
                  <StatementEditable value={statement.statement} key={statement.id}></StatementEditable>
                </Box>
              );
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
      <AppBottomButtons
        left={{ label: 'home', primary: false, action: () => navigate('..') }}
        right={{
          icon: <Add />,
          label: 'new',
          primary: true,
          action: () => navigate('propose'),
        }}></AppBottomButtons>
    </AppScreen>
  );
};
