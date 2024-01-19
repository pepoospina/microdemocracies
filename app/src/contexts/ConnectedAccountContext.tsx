import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useContractRead, usePublicClient } from 'wagmi';

import { registryABI } from '../utils/contracts.json';
import { AppAccount, AppChallenge, AppVouch } from '../types';
import { useProjectContext } from './ProjectContext';
import { useAccountContext } from '../wallet/AccountContext';
import { getContract } from 'viem';
import { useMember } from './MemberContext';

export type ConnectedMemberContextType = {
  tokenId?: number | null;
  account?: AppAccount;
  myVouches?: AppVouch[];
  myChallenge: AppChallenge | undefined | null;
};

const ConnectedMemberContextValue = createContext<ConnectedMemberContextType | undefined>(undefined);

export interface ConnectedMemberContextProps {
  children: ReactNode;
}

export const ConnectedMemberContext = (props: ConnectedMemberContextProps) => {
  const { address: projectAddress } = useProjectContext();
  const publicClient = usePublicClient();
  const { aaAddress } = useAccountContext();

  const { data: tokenId, isSuccess } = useContractRead({
    address: projectAddress,
    abi: registryABI,
    functionName: 'tokenIdOf',
    args: aaAddress ? [aaAddress] : undefined,
    enabled: aaAddress !== undefined && projectAddress !== undefined,
  });

  const { account: accountRead } = useMember({ tokenId: tokenId ? Number(tokenId) : undefined });

  const { data: myVouchEvents } = useQuery(['myVoucheEvents', tokenId?.toString()], async () => {
    if (tokenId && projectAddress) {
      const contract = getContract({
        address: projectAddress,
        abi: registryABI,
        publicClient,
      });

      const logs = await contract.getEvents.VouchEvent(
        {
          from: BigInt(tokenId),
        },
        { fromBlock: 'earliest', toBlock: 'latest' }
      );

      return logs;
    }
  });

  const [myVouches, setMyVouches] = useState<AppVouch[]>();

  useEffect(() => {
    if (!publicClient || !myVouchEvents) return;

    Promise.all(
      myVouchEvents.map(async (e: any) => {
        const block = await publicClient.getBlock(e.blockNumber);
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
    address: projectAddress,
    abi: registryABI,
    functionName: 'getChallenge',
    args: tokenId ? [tokenId] : undefined,
    enabled: tokenId !== undefined && projectAddress !== undefined,
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

  const _tokenId = tokenId ? Number(tokenId) : isSuccess ? null : undefined;

  return (
    <ConnectedMemberContextValue.Provider
      value={{
        tokenId: _tokenId,
        account: accountRead,
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
