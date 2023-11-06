import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { goerli } from 'wagmi/chains';
import { alchemyProvider as wagmiAlchemyProvider } from 'wagmi/providers/alchemy';

import { ALCHEMY_KEY } from '../config/appConfig';
import { AlchemyProvider } from '@alchemy/aa-alchemy';
import { LightSmartContractAccount, getDefaultLightAccountFactoryAddress } from '@alchemy/aa-accounts';
import { createMagicSigner } from './magic.signer';
import { WalletClientSigner } from '@alchemy/aa-core';
import { constants } from 'ethers';
import { HexStr } from '../types';
import { createInjectedSigner } from './injected.signer';
import { chain } from './config';

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

  const connectMagic = () => {
    createMagicSigner().then((signer) => setMagicSigner(signer));
  };

  const connectInjected = () => {
    const signer = createInjectedSigner();
    setInjectedSigner(signer);
  };

  const hasInjected = (window as any).ethereum !== undefined;

  const setProvider = (signer: WalletClientSigner) => {
    const provider = new AlchemyProvider({
      apiKey: 'ALCHEMY_API_KEY',
      chain: chain as any,
    }).connect(
      (rpcClient) =>
        new LightSmartContractAccount({
          entryPointAddress: constants.AddressZero,
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

  /** WAGMI provider to read data */
  const { publicClient, webSocketPublicClient } = configureChains(
    [goerli],
    [wagmiAlchemyProvider({ apiKey: ALCHEMY_KEY })]
  );

  const config = createConfig({
    publicClient,
    webSocketPublicClient,
  });

  return (
    <ProviderContextValue.Provider
      value={{ connectMagic, aaProvider: alchemyProviderAA, aaAddress, connectInjected, hasInjected }}>
      <WagmiConfig config={config}>{props.children}</WagmiConfig>
    </ProviderContextValue.Provider>
  );
};

export const useProviderContext = (): ProviderContextType => {
  const context = useContext(ProviderContextValue);
  if (!context) throw Error('context not found');
  return context;
};
