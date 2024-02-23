import { useQuery } from '@tanstack/react-query';
import { Box, Text } from 'grommet';
import { useTranslation } from 'react-i18next';
import { useReadContract } from 'wagmi';

import { CHAIN_ID } from '../../config/appConfig';
import { HexStr } from '../../types';
import { Address } from '../../ui-components';
import { LoadingDiv } from '../../ui-components/LoadingDiv';
import { aaWalletAbi } from '../../utils/contracts.json';
import { useAppSigner } from '../../wallet/SignerContext';

export const AccountAddress = (props: {
  account?: HexStr;
  showAccount?: boolean;
}) => {
  const { address } = useAppSigner();
  const { t } = useTranslation();

  const showAccount =
    props.showAccount !== undefined ? props.showAccount : false;

  const { data: _owner, isLoading } = useReadContract({
    abi: aaWalletAbi,
    address: props.account,
    functionName: 'owner',
    query: { enabled: props.account !== undefined },
  });

  const owner = _owner ? _owner : address;

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
