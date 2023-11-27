import { Box, Text } from 'grommet';
import { FUNCTIONS_BASE } from '../../config/appConfig';
import { AppButton } from '../../ui-components';

const run = async () => {
  const res = await fetch(FUNCTIONS_BASE + '/project/deleteApplication', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: '0x63aE6684Aa636eBb9109b5a5BfcFfbd3B4EC661C' }),
  });

  const body = await res.json();
  return body.success;
};

export const Test = () => {
  return (
    <Box fill align="center">
      <Text>Test</Text>
      <AppButton onClick={() => run()} label="run"></AppButton>
    </Box>
  );
};
