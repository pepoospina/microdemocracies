import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

import { AlchemyProvider } from '@alchemy/aa-alchemy';
import { LightSmartContractAccount, getDefaultLightAccountFactoryAddress } from '@alchemy/aa-accounts';
import { LocalAccountSigner, UserOperationCallData, WalletClientSigner } from '@alchemy/aa-core';
import { HexStr } from '../types';
import { chain } from './config';
import { useContractRead, usePublicClient } from 'wagmi';
import { ALCHEMY_GAS_POLICY_ID, ALCHEMY_KEY } from '../config/appConfig';
import { DecodeEventLogReturnType, decodeEventLog, getAddress } from 'viem';
import { useAppSigner } from './SignerContext';
import { MessageSigner } from '../utils/identity';
import { aaWalletAbi, getFactoryAddress, registryABI, registryFactoryABI } from '../utils/contracts.json';
import { AccountDataContext } from './AccountDataContext';
import { mnemonic } from '../test/.mnemonic';

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
  signMessageAA?: MessageSigner;
};

const AccountContextValue = createContext<AccountContextType | undefined>(undefined);

/** Manages the AA user ops and their execution */
export const AccountContext = (props: PropsWithChildren) => {
  const { signer, address: signerAddress } = useAppSigner();
  const publicClient = usePublicClient();

  /** ALCHEMY provider to send transactions using AA */
  const [alchemyProviderAA, setAlchemyProviderAA] = useState<AlchemyProvider>();
  const [aaAddress, setAaAddress] = useState<HexStr>();
  const [userOps, setUserOps] = useState<UserOperationCallData[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const [events, setEvents] = useState<DecodeEventLogReturnType[]>();

  const isConnected = alchemyProviderAA !== undefined;

  const signMessageAA = alchemyProviderAA ? (message: string) => alchemyProviderAA.signMessage(message) : undefined;

  const reset = () => {
    setIsSuccess(false);
    setIsSending(false);
    setError(undefined);
    setEvents(undefined);
    setUserOps([]);
  };

  const {
    data: _owner,
    error: ownerError,
    status: statusOwner,
  } = useContractRead({
    abi: aaWalletAbi,
    address: aaAddress,
    functionName: 'owner',
    enabled: aaAddress !== undefined,
  });

  const owner = (() => {
    if (!aaAddress) return undefined;
    if (!signerAddress) return undefined;
    if (
      ownerError &&
      (ownerError as any).shortMessage === 'The contract function "owner" returned no data ("0x").' &&
      signerAddress
    )
      return signerAddress;
    return _owner;
  })();

  const setProvider = (signer: WalletClientSigner) => {
    const provider = new AlchemyProvider({
      apiKey: ALCHEMY_KEY,
      chain: chain as any,
    }).connect((rpcClient) => {
      return new LightSmartContractAccount({
        chain: rpcClient.chain,
        owner: signer,
        factoryAddress: getDefaultLightAccountFactoryAddress(chain as any),
        rpcClient,
      });
    });

    provider.withAlchemyGasManager({ policyId: ALCHEMY_GAS_POLICY_ID });

    setAlchemyProviderAA(provider);
    console.log('created aa provider', { provider });
  };

  /** keep the alchemy provider in sync with selected signer */
  useEffect(() => {
    if (!signer) return;
    setProvider(signer);
  }, [signer]);

  useEffect(() => {
    if (alchemyProviderAA) {
      alchemyProviderAA.getAddress().then((address) => {
        setAaAddress(getAddress(address));
        console.log('computed aa address', { aaAddress: address });
      });
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
      const targets = _userOps.map((op) => op.target.toLowerCase());

      // extract all events from the target contracts (events from other callers would be here too... hmmm)
      const logs = tx.logs.filter((log: any) => targets.includes(log.address.toLowerCase()));
      const factoryAddress = await getFactoryAddress();

      console.log({ logs });
      const events = logs
        .map((log: any) => {
          if (log.address.toLowerCase() === factoryAddress.toLowerCase()) {
            return decodeEventLog({ abi: registryFactoryABI, data: log.data, topics: log.topics });
          } else {
            try {
              return decodeEventLog({ abi: registryABI, data: log.data, topics: log.topics });
            } catch (e) {
              return undefined;
            }
          }
        })
        .filter((e: any) => e !== undefined);

      console.log({ events });

      setIsSuccess(true);
      setIsSending(false);
      setEvents(events);
      setUserOps([]);
    } catch (e: any) {
      console.error(e);
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
        signMessageAA,
      }}>
      <AccountDataContext>{props.children}</AccountDataContext>
    </AccountContextValue.Provider>
  );
};

export const useAccountContext = (): AccountContextType => {
  const context = useContext(AccountContextValue);
  if (!context) throw Error('context not found');
  return context;
};
