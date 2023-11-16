import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

import { createMagicSigner } from './magic.signer';
import { WalletClientSigner } from '@alchemy/aa-core';
import { createInjectedSigner } from './injected.signer';
import { InjectedConnector } from '@wagmi/core';
import { useConnect } from 'wagmi';
import { HexStr } from '../types';
import { MessageSigner } from '../utils/identity';

export type SignerContextType = {
  connectMagic: () => void;
  connectInjected: () => void;
  hasInjected: boolean;
  signer?: WalletClientSigner;
  address?: HexStr;
  signMessage?: MessageSigner;
  isConnecting: boolean;
  errorConnecting?: Error;
};

const ProviderContextValue = createContext<SignerContextType | undefined>(undefined);

export const SignerContext = (props: PropsWithChildren) => {
  const [address, setAddress] = useState<HexStr>();
  const [magicSigner, setMagicSigner] = useState<WalletClientSigner>();
  const [injectedSigner, setInjectedSigner] = useState<WalletClientSigner>();

  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [errorConnecting, setErrorConnecting] = useState<Error>();

  const signer = injectedSigner ? injectedSigner : magicSigner;

  useEffect(() => {
    if (signer) {
      signer.getAddress().then((adr) => setAddress(adr));
    }
  }, [signer]);

  const { connectAsync } = useConnect({ connector: new InjectedConnector() });

  const connectMagic = () => {
    console.log('connecting magic signer', { signer });
    createMagicSigner().then((signer) => {
      console.log('connected magic signer', { signer });
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

  const signMessage = signer ? signer.signMessage : undefined;

  return (
    <ProviderContextValue.Provider
      value={{
        connectMagic,
        connectInjected,
        isConnecting,
        errorConnecting,
        signMessage,
        hasInjected,
        signer,
        address,
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
