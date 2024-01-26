import { useState } from 'react';
import { Box, Text } from 'grommet';

import { LanguageSelector, LanguageValue } from '../../pages/account/LanguageSelector';
import { Address, AppButton, AppCircleDropButton, AppCircleDropButtonResponsive } from '../../ui-components';
import { useAccountContext } from '../../wallet/AccountContext';
import { useAppSigner } from '../../wallet/SignerContext';
import { Loading } from '../../pages/common/Loading';
import { CHAIN_ID } from '../../config/appConfig';
import { cap } from '../../utils/general';
import { useSemaphoreContext } from '../../contexts/SemaphoreContext';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from './ThemedApp';
import { UserExpert } from 'grommet-icons';
import { AppConnectButton } from './AppConnectButton';

export const ConnectedUser = (props: {}) => {
  const { t } = useTranslation();
  const { isConnecting, address } = useAppSigner();
  const { aaAddress, isConnected } = useAccountContext();
  const { isCreatingPublicId, disconnect } = useSemaphoreContext();
  const { constants } = useThemeContext();

  const [showDrop, setShowDrop] = useState<boolean>(false);

  const content = (() => {
    if (!isConnected) {
      return <AppConnectButton style={{ fontSize: '16px', padding: '6px 8px' }}></AppConnectButton>;
    }

    if (isConnecting || !address || !aaAddress || isCreatingPublicId) {
      return <Loading></Loading>;
    }

    return (
      <AppCircleDropButton
        plain
        label={<UserExpert color={constants.colors.primary} style={{ margin: '2px 0px 0px 5px' }}></UserExpert>}
        open={showDrop}
        onClose={() => setShowDrop(false)}
        onOpen={() => setShowDrop(true)}
        dropContent={
          <Box pad="20px" gap="small">
            <Box margin={{ bottom: 'small' }}>
              <Text>{cap(t('connectedAs'))}</Text>
              <Address address={address} chainId={CHAIN_ID}></Address>
            </Box>
            <Box margin={{ bottom: 'small' }}>
              <Text margin={{ bottom: '3px' }}>{cap(t('language'))}</Text>
              <LanguageSelector></LanguageSelector>
            </Box>

            <AppButton plain onClick={() => disconnect()} style={{ textTransform: 'none', paddingTop: '6px' }}>
              <Text style={{ fontWeight: 'bold' }}>{cap(t('logout'))}</Text>
            </AppButton>
          </Box>
        }
        dropProps={{ style: { marginTop: '60px' } }}></AppCircleDropButton>
    );
  })();

  return (
    <Box style={{ width: '84px', height: '60px' }} align="center" justify="center">
      {content}
    </Box>
  );
};
