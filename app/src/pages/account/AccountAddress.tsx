import { Box, Text } from 'grommet';
import { useReadContract } from 'wagmi';
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

export const AccountAddress = (props: {
  account?: HexStr;
  showAccount?: boolean;
}) => {
  const { t } = useTranslation();

  const showAccount =
    props.showAccount !== undefined ? props.showAccount : false;

  const { data: owner, isLoading } = useReadContract({
    address: props.account,
    abi,
    functionName: 'owner',
    query: { enabled: props.account !== undefined },
  });

  if (!props.account) {
    return <LoadingDiv></LoadingDiv>;
  }

  return (
    <div>
      {showAccount ? (
        <Box style={{ float: 'left' }} direction="row">
          <Address
            digits={4}
            address={props.account}
            chainId={CHAIN_ID}></Address>
          <Text margin={{ horizontal: 'small' }}>-</Text>
        </Box>
      ) : (
        <></>
      )}
      <Box style={{ float: 'left' }} direction="row">
        <Text style={{ marginRight: '4px' }}>{t('ownedBy')}</Text>
        {owner && !isLoading ? (
          <Address digits={4} address={owner} chainId={CHAIN_ID}></Address>
        ) : (
          <LoadingDiv></LoadingDiv>
        )}
      </Box>
    </div>
  );
};
