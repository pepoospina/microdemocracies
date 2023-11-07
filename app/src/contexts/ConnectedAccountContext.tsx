import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useContractRead, usePublicClient } from 'wagmi';

import { RegistryAbi, VouchEventAbi } from '../utils/contracts.json';
import { AppAccount, AppChallenge, AppVouch } from '../types';
import { useRegistry } from './ProjectContext';
import { useAccountContext } from '../wallet/AccountContext';

export type ConnectedMemberContextType = {
  tokenId?: number;
  account?: AppAccount;
  myVouches?: AppVouch[];
  myChallenge: AppChallenge | undefined | null;
};

const ConnectedMemberContextValue = createContext<ConnectedMemberContextType | undefined>(undefined);

export interface ConnectedMemberContextProps {
  children: ReactNode;
}

export const ConnectedMemberContext = (props: ConnectedMemberContextProps) => {
  const { registryAddress } = useRegistry();
  const publicClient = usePublicClient();

  const { aaAddress } = useAccountContext();

  const { data: tokenId } = useContractRead({
    address: registryAddress,
    abi: RegistryAbi,
    functionName: 'tokenIdOf',
    args: aaAddress ? [aaAddress] : undefined,
    enabled: aaAddress !== undefined,
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
    <ConnectedMemberContextValue.Provider
      value={{
        tokenId: Number(tokenId),
        account,
        myChallenge,
        myVouches,
      }}>
      {props.children}
    </ConnectedMemberContextValue.Provider>
  );
};

export const useConnectedMember = (): ConnectedMemberContextType => {
  const context = useContext(ConnectedMemberContextValue);
  if (!context) throw Error('context not found');
  return context;
};
