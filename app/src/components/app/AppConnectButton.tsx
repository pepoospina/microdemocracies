import { BoxExtendedProps } from 'grommet';
import { AppButton, AppHeading } from '../../ui-components';
import { useAppSigner } from '../../wallet/SignerContext';
import { useTranslation } from 'react-i18next';
import { useSemaphoreContext } from '../../contexts/SemaphoreContext';
import { useAccountContext } from '../../wallet/AccountContext';
import { Loading } from '../../pages/common/Loading';
import { StatusGood } from 'grommet-icons';

export const AppConnectButton = (props: { label?: string } & BoxExtendedProps) => {
  const { t } = useTranslation();
  const { hasInjected, connectInjected, connectMagic } = useAppSigner();

  const connect = () => {
    if (hasInjected) {
      connectInjected();
    } else {
      connectMagic();
    }
  };

  return <AppButton style={{ ...props.style }} onClick={() => connect()} label={t('connectWalletBtn')}></AppButton>;
};

export const AppConnectWidget = () => {
  const { t } = useTranslation();
  const { isConnecting, address } = useAppSigner();
  const { isConnected, aaAddress } = useAccountContext();
  const { publicId } = useSemaphoreContext();

  const isFullyConnected = isConnected && publicId !== undefined && aaAddress !== undefined;
  const isLoading = isConnecting || (address && !isFullyConnected);

  if (!isFullyConnected) {
    return (
      <>
        <AppHeading level="3" style={{ marginBottom: '18px' }}>
          {t('connectAccount')}
        </AppHeading>
        {isLoading ? <Loading></Loading> : <AppConnectButton></AppConnectButton>}
      </>
    );
  }

  return (
    <>
      <AppHeading level="3" style={{ marginBottom: '18px' }}>
        {t('accountReady')}
      </AppHeading>
      <StatusGood size="48px" />
    </>
  );
};
