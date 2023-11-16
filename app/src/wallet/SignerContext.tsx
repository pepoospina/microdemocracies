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
};

const ProviderContextValue = createContext<SignerContextType | undefined>(undefined);

export const SignerContext = (props: PropsWithChildren) => {
  const [address, setAddress] = useState<HexStr>();
  const [magicSigner, setMagicSigner] = useState<WalletClientSigner>();
  const [injectedSigner, setInjectedSigner] = useState<WalletClientSigner>();

  const signer = injectedSigner ? injectedSigner : magicSigner;

  useEffect(() => {
    if (signer) {
      signer.getAddress().then((adr) => setAddress(adr));
    }
  }, [signer]);

  const { connectAsync } = useConnect({ connector: new InjectedConnector() });

  const connectMagic = () => {
    createMagicSigner().then((signer) => setMagicSigner(signer));
  };

  const connectInjected = () => {
    connectAsync().then((res) => {
      const signer = createInjectedSigner();
      setInjectedSigner(signer);
    });
  };

  const hasInjected = (window as any).ethereum !== undefined;

  const signMessage = signer ? signer.signMessage : undefined;

  return (
    <ProviderContextValue.Provider
      value={{
        connectMagic,
        connectInjected,
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
