import { Box, Spinner, Text } from 'grommet';

export const Loading = (props: { label?: string }) => {
  return (
    <Box align="center">
      <Box>
        <Text>{props.label || 'Loading'}</Text>
      </Box>
      <Box style={{ margin: '16px 0px' }} align="center" justify="center">
        <Spinner></Spinner>
      </Box>
    </Box>
  );
};

export const WaitingTransaction = () => {
  return <Loading label="Waiting for transaction"></Loading>;
};
