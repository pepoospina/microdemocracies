import { AppButton, IButton } from '../../ui-components';
import { useConnectedAccount } from '../../contexts/ConnectedAccountContext';

interface IAppConectAnd extends IButton {}

export const AppConnect = (props: IAppConectAnd) => {
  const { connect, address, isConnected } = useConnectedAccount();

  const clicked = () => {
    if (!isConnected) {
      connect();
    }
  };

  return <AppButton label={isConnected ? address : 'CONNECT'} {...props} onClick={() => clicked()}></AppButton>;
};
