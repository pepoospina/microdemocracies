import { useState } from 'react';
import { Box, Text } from 'grommet';

import { LanguageSelector } from '../../pages/account/LanguageSelector';
import { Address, AppButton, AppCircleDropButtonResponsive } from '../../ui-components';
import { useAccountContext } from '../../wallet/AccountContext';
import { BoxCentered } from '../../ui-components/BoxCentered';
import { AppConnectButton } from './AppConnectButton';
import { useAppSigner } from '../../wallet/SignerContext';
import { Loading } from '../../pages/common/Loading';
import { t } from 'i18next';
import { CHAIN_ID } from '../../config/appConfig';
import { cap } from '../../utils/general';
import { useSemaphoreContext } from '../../contexts/SemaphoreContext';

export const ConnectedUser = (props: {}) => {
  const { address } = useAppSigner();
  const { isConnected, aaAddress } = useAccountContext();
  const { disconnect } = useSemaphoreContext();

  const [showDrop, setShowDrop] = useState<boolean>();

  if (!isConnected) {
    return (
      <BoxCentered fill>
        <AppConnectButton></AppConnectButton>
      </BoxCentered>
    );
  }

  if (!address || !aaAddress) {
    return (
      <BoxCentered fill>
        <Loading></Loading>
      </BoxCentered>
    );
  }

  return (
    <AppCircleDropButtonResponsive
      label={<Box>Icon</Box>}
      open={showDrop}
      onClose={() => setShowDrop(false)}
      onOpen={() => setShowDrop(true)}
      dropContent={
        <Box pad="20px" gap="small">
          <Box direction="row" margin={{ bottom: 'small' }}>
            <Text>{cap(t('account'))}</Text>: {<Address address={aaAddress} chainId={CHAIN_ID}></Address>}
          </Box>
          <Box direction="row">
            <Text>{t('owner')}</Text>: {<Address address={address} chainId={CHAIN_ID}></Address>}
          </Box>
          <LanguageSelector></LanguageSelector>
          <AppButton plain>
            <Text>{t('logout')}</Text>
          </AppButton>
        </Box>
      }
      dropProps={{ style: {} }}></AppCircleDropButtonResponsive>
  );
};
