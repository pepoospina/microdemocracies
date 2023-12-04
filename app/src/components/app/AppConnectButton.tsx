import { AppButton, AppModal, IButton } from '../../ui-components';
import { Box } from 'grommet';
import { useState } from 'react';
import { AppConnect } from './AppConnect';
import { useAppSigner } from '../../wallet/SignerContext';
import { useTranslation } from 'react-i18next';

export const AppConnectButton = (props: IButton) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState<boolean>();

  const { hasInjected, connectInjected } = useAppSigner();

  const connect = () => {
    if (hasInjected) {
      connectInjected();
    } else {
      setShowModal(true);
    }
  };

  return (
    <Box>
      {showModal ? (
        <AppModal heading={t('connect')} onClosed={() => setShowModal(false)}>
          <AppConnect></AppConnect>
        </AppModal>
      ) : (
        <AppButton label={t('connect')} onClick={() => connect()} style={{ ...props.style }}></AppButton>
      )}
    </Box>
  );
};
