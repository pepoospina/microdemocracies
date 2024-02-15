import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useDisconnect, useWalletClient } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { WalletClientSigner } from '@alchemy/aa-core';

import { createMagicSigner, magic } from './magic.signer';
import { HexStr } from '../types';
import { MessageSigner } from '../utils/identity';

export type SignerContextType = {
  connectMagic: () => void;
  connectInjected: () => void;
  connectTest: (ix: number) => void;
  hasInjected: boolean;
  signer?: WalletClientSigner;
  address?: HexStr;
  signMessage?: MessageSigner;
  isConnecting: boolean;
  isChecking: boolean;
  errorConnecting?: Error;
  disconnect: () => void;
};

const ProviderContextValue = createContext<SignerContextType | undefined>(
  undefined
);

export const SignerContext = (props: PropsWithChildren) => {
  const { open: openConnectModal } = useWeb3Modal();

  const [address, setAddress] = useState<HexStr>();
  const [magicSigner, setMagicSigner] = useState<WalletClientSigner>();

  const { data: injectedSigner } = useWalletClient();

  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [errorConnecting, setErrorConnecting] = useState<Error>();

  const signer = injectedSigner ? injectedSigner : magicSigner;

  useEffect(() => {
    setIsChecking(true);
    magic.user.isLoggedIn().then((res) => {
      if (res) {
        console.log('Autoconnecting Magic');
        connectMagic();
      } else {
        setIsChecking(false);
      }
    });
  }, []);

  useEffect(() => {
    if (signer) {
      if (injectedSigner) {
        setAddress(injectedSigner.account.address);
      } else {
        if (!magicSigner) throw new Error('unexpected');
        magicSigner.getAddress().then((address) => {
          setAddress(address);
        });
      }
    } else {
      setAddress(undefined);
    }
  }, [signer]);

  const { disconnect: disconnectInjected } = useDisconnect();

  const connectMagic = () => {
    console.log('connecting magic signer', { signer });
    setIsChecking(false);
    setIsConnecting(true);
    createMagicSigner().then((signer) => {
      console.log('connected magic signer', { signer });
      setIsConnecting(false);
      setMagicSigner(signer);
    });
  };

  const connectInjected = () => {
    openConnectModal();
  };

  const hasInjected = (window as any).ethereum !== undefined;

  const signMessage = (() => {
    if (!signer) return undefined;
    const client = (signer as any).client;
    if (client && client.account)
      return (message: string) => client.account.signMessage({ message });

    return (message: string) => signer.signMessage(message as any);
  })();

  const disconnect = () => {
    disconnectInjected();

    magic.user.logout();
    setMagicSigner(undefined);
  };

  return (
    <ProviderContextValue.Provider
      value={{
        connectMagic,
        connectInjected,
        connectTest: () => {},
        isConnecting,
        isChecking,
        errorConnecting,
        signMessage,
        hasInjected,
        signer: signer as any,
        address,
        disconnect,
      }}>
      {props.children}
    </ProviderContextValue.Provider>
  );
};

export const useAppSigner = (): SignerContextType => {
  const context = useContext(ProviderContextValue);
  if (!context) throw Error('context not found');
  return context;
};
