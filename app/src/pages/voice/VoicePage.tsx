import { Box, Spinner, Text } from 'grommet';
import { Add } from 'grommet-icons';

import { AppCard } from '../../ui-components';
import { AppScreen, BottomButtons } from '../../ui-components/AppFormScreen';
import { RouteNames } from '../../App';
import { useNavigate } from 'react-router-dom';
import { useVoiceRead } from '../../contexts/VoiceReadContext';
import { Statement } from './Statement';

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
                <Statement
                  key={statement.id}
                  statement={statement}
                  boxStyle={{ marginBottom: '32px', flexShrink: 0 }}></Statement>
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
      <BottomButtons
        left={{ label: 'home', primary: false, action: () => navigate(RouteNames.Base) }}
        right={{
          icon: <Add />,
          label: 'propose new',
          primary: true,
          action: () => navigate(RouteNames.VoicePropose),
        }}></BottomButtons>
    </AppScreen>
  );
};
