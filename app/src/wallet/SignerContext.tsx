import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

import { createMagicSigner, magic } from './magic.signer';
import { WalletClientSigner } from '@alchemy/aa-core';
import { createInjectedSigner } from './injected.signer';
import { InjectedConnector } from '@wagmi/core';
import { useConnect, useDisconnect } from 'wagmi';
import { HexStr } from '../types';
import { MessageSigner } from '../utils/identity';
import { createTestSigner } from '../test/test.signer';

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

const ProviderContextValue = createContext<SignerContextType | undefined>(undefined);

export const SignerContext = (props: PropsWithChildren) => {
  const [address, setAddress] = useState<HexStr>();
  const [magicSigner, setMagicSigner] = useState<WalletClientSigner>();
  const [injectedSigner, setInjectedSigner] = useState<WalletClientSigner>();

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
    if (signer && signer) {
      signer.getAddress().then((adr) => setAddress(adr));
    } else {
      setAddress(undefined);
    }
  }, [signer]);

  const { connectAsync } = useConnect({ connector: new InjectedConnector() as any });
  const { disconnect: disconnectInjected } = useDisconnect();

  const connectTest = (ix: number) => {
    console.log('connecting test signer', { ix });
    const signer = createTestSigner(ix);
    setInjectedSigner(signer);
  };

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
    console.log('connecting injected signer', { signer });
    setIsConnecting(true);
    connectAsync()
      .then((res) => {
        const signer = createInjectedSigner();
        console.log('connected injected signer', { signer });
        setInjectedSigner(signer);
        setIsConnecting(false);
      })
      .catch((e) => {
        console.error('error connecting injected signer', { e });
        setErrorConnecting(e);
        setIsConnecting(false);
      });
  };

  const hasInjected = (window as any).ethereum !== undefined;

  const signMessage = (() => {
    if (!signer) return undefined;
    const client = (signer as any).client;
    if (client && client.account) return (message: string) => client.account.signMessage({ message });

    return signer.signMessage;
  })();

  const disconnect = () => {
    disconnectInjected();
    setInjectedSigner(undefined);

    magic.user.logout();
    setMagicSigner(undefined);
  };

  return (
    <ProviderContextValue.Provider
      value={{
        connectMagic,
        connectInjected,
        connectTest,
        isConnecting,
        isChecking,
        errorConnecting,
        signMessage,
        hasInjected,
        signer,
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
