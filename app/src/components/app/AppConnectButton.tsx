import { AppButton, AppModal, IButton } from '../../ui-components';
import { Box } from 'grommet';
import { useState } from 'react';
import { AppConnect } from './AppConnect';
import { useAppSigner } from '../../wallet/SignerContext';

interface IAppConectAnd extends IButton {}

export const AppConnectButton = (props: IAppConectAnd) => {
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
        <AppModal heading="Connect" onClosed={() => setShowModal(false)}>
          <AppConnect></AppConnect>
        </AppModal>
      ) : (
        <AppButton label="Connect" onClick={() => connect()}></AppButton>
      )}
    </Box>
  );
};
