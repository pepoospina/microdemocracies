import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

import { AlchemyProvider } from '@alchemy/aa-alchemy';
import { LightSmartContractAccount, getDefaultLightAccountFactoryAddress } from '@alchemy/aa-accounts';
import { createMagicSigner } from './magic.signer';
import { UserOperationCallData, WalletClientSigner } from '@alchemy/aa-core';
import { HexStr } from '../types';
import { createInjectedSigner } from './injected.signer';
import { chain } from './config';
import { InjectedConnector } from '@wagmi/core';
import { useConnect, usePublicClient } from 'wagmi';
import { ALCHEMY_KEY } from '../config/appConfig';
import { DecodeEventLogReturnType, decodeEventLog } from 'viem';
import { RegistryFactoryAbi, registryFactoryAddress } from '../utils/contracts.json';

export type ProviderContextType = {
  connectMagic: () => void;
  connectInjected: () => void;
  hasInjected: boolean;
  aaAddress?: HexStr;
  addUserOp?: (userOp: UserOperationCallData) => void;
  sendUserOps?: () => void;
  isSending: boolean;
  isSuccess: boolean;
  error?: string;
  events?: DecodeEventLogReturnType[];
};

const ProviderContextValue = createContext<ProviderContextType | undefined>(undefined);

export const ProviderContext = (props: PropsWithChildren) => {
  const publicClient = usePublicClient();

  /** ALCHEMY provider to send transactions using AA */
  const [alchemyProviderAA, setAlchemyProviderAA] = useState<AlchemyProvider>();
  const [aaAddress, setAaAddress] = useState<HexStr>();
  const [userOps, setUserOps] = useState<UserOperationCallData[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const [events, setEvents] = useState<DecodeEventLogReturnType[]>();

  const [magicSigner, setMagicSigner] = useState<WalletClientSigner>();
  const [injectedSigner, setInjectedSigner] = useState<WalletClientSigner>();

  const reset = () => {
    setIsSuccess(false);
    setIsSending(false);
    setError(undefined);
    setEvents(undefined);
    setUserOps([]);
  };

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

  const addUserOp = alchemyProviderAA
    ? (userOp: UserOperationCallData) => {
        if (!alchemyProviderAA) throw new Error(`alchemyProvider not defined`);
        if (isSending) throw new Error('Cannot add userOps while sending');
        setUserOps(userOps.concat(userOp));
      }
    : undefined;

  const sendUserOps =
    alchemyProviderAA && userOps.length > 0
      ? async () => {
          setIsSending(true);
          try {
            const res = await alchemyProviderAA.sendUserOperation(userOps);
            const txHash = await alchemyProviderAA.waitForUserOperationTransaction(res.hash);
            const tx = await (publicClient as any).waitForTransactionReceipt({ hash: txHash });

            console.log({ registryFactoryAddress, txlogs: tx.logs });
            const logs = tx.logs.filter(
              (log: any) => log.address.toLowerCase() === registryFactoryAddress.toLowerCase()
            );
            console.log({ logs });
            const events = logs.map((log: any) => {
              return (decodeEventLog as any)({ abi: RegistryFactoryAbi, data: log.data, topics: log.topics });
            });

            console.log({ events });

            setIsSuccess(true);
            setIsSending(false);
            setEvents(events);
          } catch (e: any) {
            setError(e);
          }
        }
      : undefined;

  return (
    <ProviderContextValue.Provider
      value={{
        connectMagic,
        aaAddress,
        connectInjected,
        hasInjected,
        addUserOp,
        sendUserOps,
        isSuccess,
        isSending,
        events,
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
