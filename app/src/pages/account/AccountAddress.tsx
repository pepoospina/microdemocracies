import { useQuery } from '@tanstack/react-query';
import { Box, Text } from 'grommet';
import { useTranslation } from 'react-i18next';

import { CHAIN_ID } from '../../config/appConfig';
import { HexStr } from '../../types';
import { Address } from '../../ui-components';
import { LoadingDiv } from '../../ui-components/LoadingDiv';
import { useAccountContext } from '../../wallet/AccountContext';
import { useAppSigner } from '../../wallet/SignerContext';

export const AccountAddress = (props: {
  account?: HexStr;
  showAccount?: boolean;
}) => {
  const { address } = useAppSigner();
  const { alchemyClient } = useAccountContext();
  const { t } = useTranslation();

  const showAccount =
    props.showAccount !== undefined ? props.showAccount : false;

  const { data: owners, isLoading } = useQuery({
    queryKey: [`ownersOf`, props.account],
    queryFn: async (): Promise<string[] | null> => {
      if (!alchemyClient) return null;
      return (alchemyClient as any).readOwners();
    },
  });

  const owner = owners && owners.length ? (owners as any)[0] : address;

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
