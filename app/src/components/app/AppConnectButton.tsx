import { AppButton, AppModal, IButton } from '../../ui-components';
import { Box } from 'grommet';
import { useState } from 'react';
import { useConnectedAccount } from '../../contexts/ConnectedAccountContext';
import { AppConnect } from './AppConnect';

interface IAppConectAnd extends IButton {}

export const AppConnectButton = (props: IAppConectAnd) => {
  const { isConnected } = useConnectedAccount();
  const [showModal, setShowModal] = useState<boolean>();

  return (
    <Box>
      {showModal ? (
        <AppModal heading="Connect" onClosed={() => setShowModal(false)}>
          <AppConnect></AppConnect>
        </AppModal>
      ) : (
        <></>
      )}
    </Box>
  );
};
