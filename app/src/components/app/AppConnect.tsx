import { useRegistry } from '../../contexts/RegistryContext';
import { AppButton, IButton } from '../../ui-components';

interface IAppConectAnd extends IButton {}

export const AppConnect = (props: IAppConectAnd) => {
  const { isConnected, connect, connectedAddress } = useRegistry();

  const clicked = () => {
    if (!isConnected) {
      connect();
    }
  };

  return (
    <AppButton label={isConnected ? connectedAddress : 'CONNECT'} {...props} onClick={() => clicked()}></AppButton>
  );
};
