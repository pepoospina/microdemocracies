import { Box, Text } from 'grommet';
import { useContractRead, useEnsName } from 'wagmi';
import { CHAIN_ID } from '../../config/appConfig';
import { HexStr } from '../../types';
import { Address } from '../../ui-components';
import { LoadingDiv } from '../../ui-components/LoadingDiv';
import { useTranslation } from 'react-i18next';

const abi = [
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
  },
] as const;

export const AccountAddress = (props: { account?: HexStr }) => {
  const { t } = useTranslation();

  const { data: owner, isLoading } = useContractRead({
    address: props.account,
    abi,
    functionName: 'owner',
    enabled: props.account !== undefined,
  });

  if (!props.account) {
    return <LoadingDiv></LoadingDiv>;
  }

  return (
    <Box direction="row">
      <Text style={{ marginRight: '4px' }}>{t('ownedBy')}</Text>
      {owner && !isLoading ? (
        <Address digits={4} address={owner} chainId={CHAIN_ID}></Address>
      ) : (
        <LoadingDiv></LoadingDiv>
      )}
    </Box>
  );
};
