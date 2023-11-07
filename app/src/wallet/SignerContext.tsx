import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

import { createMagicSigner } from './magic.signer';
import { WalletClientSigner } from '@alchemy/aa-core';
import { createInjectedSigner } from './injected.signer';
import { InjectedConnector } from '@wagmi/core';
import { useConnect } from 'wagmi';

export type SignerContextType = {
  connectMagic: () => void;
  connectInjected: () => void;
  hasInjected: boolean;
  signer?: WalletClientSigner;
};

const ProviderContextValue = createContext<SignerContextType | undefined>(undefined);

export const SignerContext = (props: PropsWithChildren) => {
  const [magicSigner, setMagicSigner] = useState<WalletClientSigner>();
  const [injectedSigner, setInjectedSigner] = useState<WalletClientSigner>();

  const signer = injectedSigner ? injectedSigner : magicSigner;

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

  return (
    <ProviderContextValue.Provider
      value={{
        connectMagic,
        connectInjected,
        hasInjected,
        signer,
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
