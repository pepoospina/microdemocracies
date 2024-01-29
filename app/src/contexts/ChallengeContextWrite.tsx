import { useContractRead } from 'wagmi';

import { registryABI } from '../utils/contracts.json';
import { VoteOption } from '../types';
import { useProjectContext } from './ProjectContext';
import { useAccountContext } from '../wallet/AccountContext';
import { encodeFunctionData } from 'viem';
import { useCallback, useState } from 'react';

export type ChallengeContextWriteType = {
  sendChallenge?: () => void;
  isChallenging: boolean;
  isErrorChallenging: boolean;
  errorChallenging?: Error;
  canVote?: boolean;
  sendVote?: (vote: VoteOption) => void;
  isVoting: boolean;
  isErrorVoting: boolean;
  errorVoting?: Error;
  myVote?: number;
  isSending: boolean;
  isSuccess: boolean;
};

export const useChallengeWrite = (tokenId?: number): ChallengeContextWriteType => {
  const { address: projectAddress } = useProjectContext();
  const { addUserOp, isSuccess, isSending, events } = useAccountContext();

  const tokenIdInternal = tokenId !== undefined ? BigInt(tokenId) : undefined;

  const [isChallenging, setIsChallening] = useState<boolean>(false);
  const [isErrorChallenging, setIsErrorChallenging] = useState<boolean>(false);
  const [errorChallenging, setErrorChallenging] = useState<Error>();

  const [isVoting, setIsVoting] = useState<boolean>(false);
  const [isErrorVoting, setIsErrorVoting] = useState<boolean>(false);
  const [errorVoting, setErrorVoting] = useState<Error>();

  /** can vote */
  const { aaAddress: connectedAddress } = useAccountContext();

  const { data: tokenIdOfAddress } = useContractRead({
    address: projectAddress,
    abi: registryABI,
    functionName: 'tokenIdOf',
    args: connectedAddress ? [connectedAddress] : undefined,
    enabled: connectedAddress !== undefined && projectAddress !== undefined,
  });

  const { data: canVote } = useContractRead({
    address: projectAddress,
    abi: registryABI,
    functionName: 'canVote',
    args: tokenIdOfAddress && tokenIdInternal ? [tokenIdOfAddress, tokenIdInternal] : undefined,
    enabled: tokenIdOfAddress !== undefined && tokenIdInternal !== undefined && projectAddress !== undefined,
  });

  const { data: _myVote } = useContractRead({
    address: projectAddress,
    abi: registryABI,
    functionName: 'getChallengeVote',
    args: tokenIdOfAddress && tokenIdInternal ? [tokenIdInternal, tokenIdOfAddress] : undefined,
    enabled: tokenIdOfAddress !== undefined && tokenIdInternal !== undefined && projectAddress !== undefined,
  });

  const myVote = _myVote !== undefined && _myVote !== 0 ? _myVote : undefined;

  /** Challenge */
  const sendChallenge = useCallback(async () => {
    if (!addUserOp || !tokenIdInternal || !projectAddress) return;

    setIsChallening(true);
    setIsErrorChallenging(false);
    setErrorChallenging(undefined);

    try {
      const callDataChallenge = encodeFunctionData({
        abi: registryABI,
        functionName: 'challenge',
        args: [tokenIdInternal],
      });

      addUserOp(
        {
          target: projectAddress,
          data: callDataChallenge,
          value: BigInt(0),
        },
        false
      );

      const callDataVote = encodeFunctionData({
        abi: registryABI,
        functionName: 'vote',
        args: [tokenIdInternal, 1],
      });

      addUserOp(
        {
          target: projectAddress,
          data: callDataVote,
          value: BigInt(0),
        },
        true
      );
    } catch (e: any) {
      setIsChallening(false);
      setIsErrorChallenging(true);
      setErrorChallenging(e);
    }
  }, []);

  /** Vote transactions */
  const sendVote = useCallback(async (vote: VoteOption) => {
    if (!addUserOp || !tokenIdInternal || !projectAddress) return;

    setIsVoting(true);
    setIsErrorVoting(false);
    setErrorVoting(undefined);

    try {
      const callDataVote = encodeFunctionData({
        abi: registryABI,
        functionName: 'vote',
        args: [tokenIdInternal, vote],
      });

      addUserOp(
        {
          target: projectAddress,
          data: callDataVote,
          value: BigInt(0),
        },
        true
      );
    } catch (e: any) {
      setIsVoting(false);
      setIsErrorVoting(true);
      setErrorVoting(e);
    }
  }, []);

  return {
    sendChallenge,
    isChallenging,
    isErrorChallenging,
    errorChallenging,
    canVote,
    sendVote,
    isVoting,
    isErrorVoting,
    errorVoting,
    myVote,
    isSuccess,
    isSending,
  };
};
