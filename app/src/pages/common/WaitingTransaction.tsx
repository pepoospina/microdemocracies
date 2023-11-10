import { Box, Spinner, Text } from 'grommet';

export const WaitingTransaction = () => {
  return (
    <Box align="center">
      <Box>
        <Text>Waiting for transaction</Text>
      </Box>
      <Box style={{ margin: '16px 0px' }} align="center" justify="center">
        <Spinner></Spinner>
      </Box>
    </Box>
  );
};
