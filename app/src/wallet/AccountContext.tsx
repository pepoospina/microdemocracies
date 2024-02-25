import {
  AlchemySmartAccountClient,
  createLightAccountAlchemyClient,
} from '@alchemy/aa-alchemy';
import {
  BatchUserOperationCallData,
  WalletClientSigner,
} from '@alchemy/aa-core';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { DecodeEventLogReturnType, decodeEventLog, getAddress } from 'viem';
import { usePublicClient, useReadContract } from 'wagmi';

import { ALCHEMY_GAS_POLICY_ID, ALCHEMY_RPC_URL } from '../config/appConfig';
import { HexStr } from '../types';
import {
  aaWalletAbi,
  getFactoryAddress,
  registryABI,
  registryFactoryABI,
} from '../utils/contracts.json';
import { AccountDataContext } from './AccountDataContext';
import { chain } from './ConnectedWalletContext';
import { useAppSigner } from './SignerContext';

const DEBUG = true;

/** Account Abstraction Manager */
export type AccountContextType = {
  isConnected: boolean;
  aaAddress?: HexStr;
  owner?: HexStr;
  sendUserOps?: (userOps: BatchUserOperationCallData) => void;
  reset: () => void;
  isSending: boolean;
  isSuccess: boolean;
  error?: Error;
  events?: DecodeEventLogReturnType[];
};

const AccountContextValue = createContext<AccountContextType | undefined>(
  undefined
);

/** Manages the AA user ops and their execution */
export const AccountContext = (props: PropsWithChildren) => {
  const { signer, address } = useAppSigner();
  const publicClient = usePublicClient();

  /** ALCHEMY provider to send transactions using AA */
  const [alchemyClientAA, setAlchemyClientAA] =
    useState<AlchemySmartAccountClient>();
  const [aaAddress, setAaAddress] = useState<HexStr>();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const [events, setEvents] = useState<DecodeEventLogReturnType[]>();

  // gasManagerConfig: {
  //   policyId: ALCHEMY_GAS_POLICY_ID,
  // },

  useEffect(() => {
    if (signer) {
      createLightAccountAlchemyClient({
        rpcUrl: ALCHEMY_RPC_URL,
        chain: chain,
        signer: new WalletClientSigner(signer, 'json-rpc'),
        gasManagerConfig: {
          policyId: ALCHEMY_GAS_POLICY_ID,
        },
      }).then((client) => {
        setAlchemyClientAA(client);
      });
    } else {
      setAlchemyClientAA(undefined);
      setAaAddress(undefined);
    }
  }, [signer]);

  const isConnected = alchemyClientAA !== undefined;

  const reset = () => {
    if (DEBUG) console.log('resetting userOps');
    setIsSuccess(false);
    setIsSending(false);
    setError(undefined);
    setEvents(undefined);
  };

  const {
    data: _owner,
    error: ownerError,
    status: statusOwner,
  } = useReadContract({
    abi: aaWalletAbi,
    address: aaAddress,
    functionName: 'owner',
    query: { enabled: aaAddress !== undefined },
  });

  const owner = (() => {
    if (!aaAddress) return undefined;
    if (!address) return undefined;
    if (
      ownerError &&
      (ownerError as any).shortMessage ===
        'The contract function "owner" returned no data ("0x").' &&
      address
    )
      return address;
    return _owner;
  })();

  useEffect(() => {
    if (alchemyClientAA) {
      // TODO: what?
      const address = (alchemyClientAA as any).getAddress();
      if (DEBUG) console.log({ aaAddress: address });
      setAaAddress(getAddress(address));
    } else {
      setAaAddress(undefined);
    }
  }, [alchemyClientAA]);

  const sendUserOps = async (_userOps: BatchUserOperationCallData) => {
    setIsSending(true);
    try {
      if (_userOps.length === 0) return;
      if (!alchemyClientAA) throw new Error('undefined alchemyClientAA');

      const uoSimResult = await (alchemyClientAA as any).simulateUserOperation({
        uo: _userOps,
      });

      if (DEBUG) console.log('uoSimResult', { uoSimResult });

      if (DEBUG) console.log('sendUserOps', { userOps: _userOps });
      const res = await (alchemyClientAA as any).sendUserOperation({
        uo: _userOps,
      });
      if (DEBUG) console.log('sendUserOps - res', { res });

      if (DEBUG) console.log('waiting');
      const txHash = await alchemyClientAA.waitForUserOperationTransaction({
        hash: res.hash,
      });

      if (DEBUG) console.log('waitForUserOperationTransaction', { txHash });

      if (DEBUG) console.log('getting tx');

      if (!publicClient) throw new Error(`publicClient undefined`);
      const tx = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });
      if (DEBUG) console.log('tx - res', { tx });

      const targets = _userOps.map((op) => op.target.toLowerCase());

      // extract all events from the target contracts (events from other callers would be here too... hmmm)
      const logs = tx.logs.filter((log: any) =>
        targets.includes(log.address.toLowerCase())
      );
      const factoryAddress = await getFactoryAddress();

      console.log({ logs });
      const events = logs
        .map((log: any) => {
          if (log.address.toLowerCase() === factoryAddress.toLowerCase()) {
            return decodeEventLog({
              abi: registryFactoryABI,
              data: log.data,
              topics: log.topics,
            });
          } else {
            try {
              return decodeEventLog({
                abi: registryABI,
                data: log.data,
                topics: log.topics,
              });
            } catch (e) {
              return undefined;
            }
          }
        })
        .filter((e: any) => e !== undefined);

      console.log({ events });

      setIsSuccess(true);
      setIsSending(false);
      setEvents(events as any);
    } catch (e: any) {
      console.error(e);
      setError(e);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      /** auto-reset everytime (isSuccess is true briefly) */
      setIsSuccess(false);
    }
  }, [isSuccess]);

  return (
    <AccountContextValue.Provider
      value={{
        isConnected,
        aaAddress,
        owner,
        sendUserOps,
        reset,
        isSuccess,
        isSending,
        events,
        error,
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
