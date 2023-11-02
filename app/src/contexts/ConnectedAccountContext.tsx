import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useAccount, useContractRead, usePublicClient } from 'wagmi';

import { registryAddress, RegistryAbi, VouchEventAbi } from '../utils/contracts.json';
import { AppAccount, AppChallenge, AppVouch } from '../types';

export type ConnectedAccountContextType = {
  isConnected: boolean;
  tokenId?: number;
  account?: AppAccount;
  myVouches?: AppVouch[];
  myChallenge: AppChallenge | undefined | null;
};

const ConnectedAccountContextValue = createContext<ConnectedAccountContextType | undefined>(undefined);

export interface ConnectedAccountContextProps {
  children: ReactNode;
}

export const ConnectedAccountContext = (props: ConnectedAccountContextProps) => {
  const publicClient = usePublicClient();

  const { address, isConnected } = useAccount();

  const { data: tokenId } = useContractRead({
    address: registryAddress,
    abi: RegistryAbi,
    functionName: 'tokenIdOf',
    args: address ? [address] : undefined,
    enabled: address !== undefined,
  });

  const { data: _accountRead } = useContractRead({
    address: registryAddress,
    abi: RegistryAbi,
    functionName: 'getAccount',
    args: tokenId ? [tokenId] : undefined,
    enabled: tokenId !== undefined,
  });

  const account = _accountRead && {
    account: _accountRead.account,
    valid: _accountRead.valid,
    voucher: Number(_accountRead.voucher),
  };

  const { data: myVouchEvents } = useQuery(['myVoucheEvents', tokenId?.toString()], async () => {
    if (tokenId) {
      const logs = await (publicClient as any).getLogs({
        address: registryAddress,
        event: VouchEventAbi,
        args: {
          from: BigInt(tokenId),
        },
        fromBlock: 'earliest',
        toBlock: 'latest',
      });

      return logs;
    }
  });

  const [myVouches, setMyVouches] = useState<AppVouch[]>();

  useEffect(() => {
    if (!publicClient || !myVouchEvents) return;

    Promise.all(
      myVouchEvents.map(async (e: any) => {
        const block = await (publicClient as any).getBlock(e.blockNumber);
        return {
          from: e.args.from.toString(),
          to: e.args.to.toString(),
          personCid: e.args.personCid,
          vouchDate: +block.timestamp.toString(),
        };
      })
    ).then((vouches) => setMyVouches(vouches));
  }, [myVouchEvents, publicClient]);

  const {
    data: _challengeRead,
    isError: isErrorChallengeRead,
    error: errorChallengeRead,
  } = useContractRead({
    address: registryAddress,
    abi: RegistryAbi,
    functionName: 'getChallenge',
    args: tokenId ? [tokenId] : undefined,
    enabled: tokenId !== undefined,
  });

  const myChallenge: AppChallenge | undefined | null = ((_challengeRead) => {
    if (isErrorChallengeRead && errorChallengeRead && errorChallengeRead.message.includes('')) {
      return null;
    }
    if (_challengeRead === undefined) {
      return undefined;
    }
    if (_challengeRead[0] > 0 && !isErrorChallengeRead) {
      return {
        creationDate: Number(_challengeRead[0]),
        endDate: Number(_challengeRead[1]),
        lastOutcome: Number(_challengeRead[2]),
        nVoted: Number(_challengeRead[3]),
        nFor: Number(_challengeRead[4]),
        executed: _challengeRead[5],
      };
    }
  })(_challengeRead);

  return (
    <ConnectedAccountContextValue.Provider
      value={{
        tokenId: Number(tokenId),
        account,
        myChallenge,
        myVouches,
        isConnected,
      }}>
      {props.children}
    </ConnectedAccountContextValue.Provider>
  );
};

export const useConnectedAccount = (): ConnectedAccountContextType => {
  const context = useContext(ConnectedAccountContextValue);
  if (!context) throw Error('context not found');
  return context;
};
