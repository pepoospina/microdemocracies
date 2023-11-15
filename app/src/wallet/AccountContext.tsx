import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

import { AlchemyProvider } from '@alchemy/aa-alchemy';
import { LightSmartContractAccount, getDefaultLightAccountFactoryAddress } from '@alchemy/aa-accounts';
import { UserOperationCallData, WalletClientSigner } from '@alchemy/aa-core';
import { HexStr } from '../types';
import { chain } from './config';
import { useContractRead, usePublicClient } from 'wagmi';
import { ALCHEMY_KEY } from '../config/appConfig';
import { DecodeEventLogReturnType, decodeEventLog } from 'viem';
import { useAppSigner } from './SignerContext';
import { MessageSigner } from '../utils/statements';
import { aaWalletAbi, getFactoryAddress, registryFactoryABI } from '../utils/contracts.json';

export type AccountContextType = {
  isConnected: boolean;
  aaAddress?: HexStr;
  owner?: HexStr;
  addUserOp?: (userOp: UserOperationCallData, send?: boolean) => void;
  reset: () => void;
  isSending: boolean;
  isSuccess: boolean;
  error?: Error;
  events?: DecodeEventLogReturnType[];
  signMessage?: MessageSigner;
};

const AccountContextValue = createContext<AccountContextType | undefined>(undefined);

/** Manages the AA user ops and their execution */
export const AccountContext = (props: PropsWithChildren) => {
  const { signer } = useAppSigner();
  const publicClient = usePublicClient();

  /** ALCHEMY provider to send transactions using AA */
  const [alchemyProviderAA, setAlchemyProviderAA] = useState<AlchemyProvider>();
  const [aaAddress, setAaAddress] = useState<HexStr>();
  const [userOps, setUserOps] = useState<UserOperationCallData[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const [events, setEvents] = useState<DecodeEventLogReturnType[]>();

  console.log({ userOps, alchemyProviderAA });

  const isConnected = signer !== undefined;

  const signMessage = alchemyProviderAA
    ? (input: { message: string }) => alchemyProviderAA.signMessage(input.message)
    : undefined;

  const reset = () => {
    setIsSuccess(false);
    setIsSending(false);
    setError(undefined);
    setEvents(undefined);
    setUserOps([]);
  };

  const { data: owner } = useContractRead({
    abi: aaWalletAbi,
    address: aaAddress,
    enabled: aaAddress !== undefined,
  });

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

  /** keep the alchemy provider in sync with selected signer */
  useEffect(() => {
    if (!signer) return;
    setProvider(signer);
  }, [signer]);

  useEffect(() => {
    if (alchemyProviderAA) {
      alchemyProviderAA.getAddress().then((address) => setAaAddress(address));
    }
  }, [alchemyProviderAA]);

  const addUserOp = alchemyProviderAA
    ? (userOp: UserOperationCallData, send: boolean = false) => {
        if (!alchemyProviderAA) throw new Error(`alchemyProvider not defined`);
        if (isSending) throw new Error('Cannot add userOps while sending');
        if (isSuccess) throw new Error('Please reset before adding userOps');

        const allUserOps = userOps.concat(userOp);
        if (send) {
          sendUserOps(allUserOps);
        } else {
          setUserOps(allUserOps);
        }
      }
    : undefined;

  const sendUserOps = async (_userOps: UserOperationCallData[]) => {
    setIsSending(true);
    try {
      if (_userOps.length === 0) return;
      if (!alchemyProviderAA) throw new Error('undefined alchemyProviderAA');

      const res = await alchemyProviderAA.sendUserOperation(_userOps);
      const txHash = await alchemyProviderAA.waitForUserOperationTransaction(res.hash);
      const tx = await (publicClient as any).waitForTransactionReceipt({ hash: txHash });
      const factoryAddress = await getFactoryAddress();

      const logs = tx.logs.filter((log: any) => log.address.toLowerCase() === factoryAddress.toLowerCase());

      console.log({ logs });
      const events = logs.map((log: any) => {
        return (decodeEventLog as any)({ abi: registryFactoryABI, data: log.data, topics: log.topics });
      });

      console.log({ events });

      setIsSuccess(true);
      setIsSending(false);
      setEvents(events);
      setUserOps([]);
    } catch (e: any) {
      setError(e);
    }
  };

  return (
    <AccountContextValue.Provider
      value={{
        isConnected,
        aaAddress,
        owner,
        addUserOp,
        reset,
        isSuccess,
        isSending,
        events,
        error,
        signMessage,
      }}>
      {props.children}
    </AccountContextValue.Provider>
  );
};

export const useAccountContext = (): AccountContextType => {
  const context = useContext(AccountContextValue);
  if (!context) throw Error('context not found');
  return context;
};
