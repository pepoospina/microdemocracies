import { Box, Spinner, Text } from 'grommet';
import { useTranslation } from 'react-i18next';
import { cap } from '../../utils/general';

export const Loading = (props: { label?: string }) => {
  const { t } = useTranslation();
  return (
    <Box align="center">
      <Box>
        <Text>{props.label || cap(t('loading'))}</Text>
      </Box>
      <Box style={{ margin: '16px 0px' }} align="center" justify="center">
        <Spinner></Spinner>
      </Box>
    </Box>
  );
};

export const WaitingTransaction = () => {
  return <Loading label={t('waitingTx')}></Loading>;
};
