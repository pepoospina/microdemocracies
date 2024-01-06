import { Box, Text } from 'grommet';
import { StatusGood } from 'grommet-icons';
import { AppButton } from '../../ui-components';
import { useAccountContext } from '../../wallet/AccountContext';
import { useAppSigner } from '../../wallet/SignerContext';
import { Loading } from '../../pages/common/Loading';
import { useSemaphoreContext } from '../../contexts/SemaphoreContext';
import { useTranslation } from 'react-i18next';
import { cap } from '../../utils/general';

export const AppConnect = (props: {}) => {
  const { t } = useTranslation();
  const { hasInjected, connectInjected, connectMagic, signer, isConnecting, isChecking } = useAppSigner();
  const { aaAddress } = useAccountContext();
  const { isCreatingPublicId } = useSemaphoreContext();

  if (isChecking) {
    return (
      <Box>
        <Loading label={cap(t('loading'))}></Loading>
      </Box>
    );
  }

  if (isConnecting) {
    return (
      <Box>
        <Loading label={cap(t('connecting'))}></Loading>
      </Box>
    );
  }

  if (isCreatingPublicId) {
    return (
      <Box>
        <Loading label={t('waitingSignatures')}></Loading>
      </Box>
    );
  }

  return !signer || !aaAddress ? (
    <Box margin={{ horizontal: 'small' }}>
      {hasInjected ? (
        <Box margin={{ vertical: 'small' }}>
          <Box margin={{ bottom: '6px' }}>
            <Text>
              {t('connectWallet')} {!hasInjected ? `(${t('notFound')})` : ''}
            </Text>
          </Box>
          <AppButton
            onClick={() => connectInjected()}
            label={t('connectWalletBtn')}
            disabled={!hasInjected}></AppButton>
        </Box>
      ) : (
        <></>
      )}

      <Box margin={{ vertical: 'small' }}>
        <AppButton onClick={() => connectMagic()} label={t('connectWithEmailBtn')}></AppButton>
      </Box>
    </Box>
  ) : (
    <>
      <Box>
        <Box direction="row" justify="center" align="center">
          <Box style={{ marginRight: '16px' }}>
            <StatusGood size="48px" />
          </Box>
          <Text size="large">{t('accountReady')}</Text>
        </Box>
      </Box>
    </>
  );
};
