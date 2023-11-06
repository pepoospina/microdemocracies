import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

import { AlchemyProvider } from '@alchemy/aa-alchemy';
import { LightSmartContractAccount, getDefaultLightAccountFactoryAddress } from '@alchemy/aa-accounts';
import { createMagicSigner } from './magic.signer';
import { WalletClientSigner } from '@alchemy/aa-core';
import { constants } from 'ethers';
import { HexStr } from '../types';
import { createInjectedSigner } from './injected.signer';
import { chain } from './config';
import { InjectedConnector } from '@wagmi/core';
import { useConnect } from 'wagmi';
import { ALCHEMY_KEY } from '../config/appConfig';

export type ProviderContextType = {
  connectMagic: () => void;
  connectInjected: () => void;
  hasInjected: boolean;
  aaProvider?: AlchemyProvider;
  aaAddress?: HexStr;
};

const ProviderContextValue = createContext<ProviderContextType | undefined>(undefined);

export const ProviderContext = (props: PropsWithChildren) => {
  /** ALCHEMY provider to send transactions using AA */
  const [alchemyProviderAA, setAlchemyProviderAA] = useState<AlchemyProvider>();
  const [aaAddress, setAaAddress] = useState<HexStr>();

  const [magicSigner, setMagicSigner] = useState<WalletClientSigner>();
  const [injectedSigner, setInjectedSigner] = useState<WalletClientSigner>();

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

  const setProvider = (signer: WalletClientSigner) => {
    const provider = new AlchemyProvider({
      apiKey: ALCHEMY_KEY,
      chain: chain as any,
    }).connect(
      (rpcClient) =>
        new LightSmartContractAccount({
          chain: rpcClient.chain,
          owner: signer,
          factoryAddress: getDefaultLightAccountFactoryAddress(chain as any),
          rpcClient,
        })
    );
    setAlchemyProviderAA(provider);
  };

  /** keep the magic alchemy provider in sync with selected signer */
  useEffect(() => {
    if (!magicSigner) return;
    setProvider(magicSigner);
  }, [magicSigner]);

  useEffect(() => {
    if (!injectedSigner) return;
    setProvider(injectedSigner);
  }, [injectedSigner]);

  useEffect(() => {
    if (alchemyProviderAA) {
      alchemyProviderAA.getAddress().then((address) => setAaAddress(address));
    }
  }, [alchemyProviderAA]);

  console.log({ alchemyProviderAA, aaAddress, hasInjected });

  return (
    <ProviderContextValue.Provider
      value={{
        connectMagic,
        aaProvider: alchemyProviderAA,
        aaAddress,
        connectInjected,
        hasInjected,
      }}>
      {props.children}
    </ProviderContextValue.Provider>
  );
};

export const useProviderContext = (): ProviderContextType => {
  const context = useContext(ProviderContextValue);
  if (!context) throw Error('context not found');
  return context;
};
