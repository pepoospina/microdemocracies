import { BoxExtendedProps } from 'grommet';
import { AppButton } from '../../ui-components';
import { useAppSigner } from '../../wallet/SignerContext';
import { useTranslation } from 'react-i18next';

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
