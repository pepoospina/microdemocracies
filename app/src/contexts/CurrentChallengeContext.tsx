import { createContext, ReactNode, useContext } from 'react';
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { WriteContractResult } from '@wagmi/core';

import { RegistryAbi } from '../utils/contracts.json';
import { AppChallenge, VoteOption } from '../types';
import { useProjectContext } from './ProjectContext';
import { useConnectedMember } from './ConnectedAccountContext';
import { useAccountContext } from '../wallet/AccountContext';

export type ChallengeContextType = {
  tokenId?: number;
  sendChallenge: (() => Promise<WriteContractResult>) | undefined;
  refetchChallenge: (options?: { throwOnError: boolean; cancelRefetch: boolean }) => Promise<any>;
  challengeRead: AppChallenge | undefined | null;
  totalVoters?: number;
  isLoadingChallenge: boolean;
  canVote: boolean | undefined;
  sendVoteRemove: (() => Promise<WriteContractResult>) | undefined;
  sendVoteKeep: (() => Promise<WriteContractResult>) | undefined;
  myVote?: VoteOption;
  isErrorSending: boolean;
  errorSending: Error | null;
  isSuccess: boolean;
  isErrorSendingVote: boolean;
  errorSendingVote: Error | null;
  isSuccessVote: boolean;
};

const ChallengeContextValue = createContext<ChallengeContextType | undefined>(undefined);

export interface ChallengeContextProps {
  tokenId?: number;
  children: ReactNode;
}

export const ChallengeContext = (props: ChallengeContextProps) => {
  const { registryAddress } = useProjectContext();

  /** Vouch */
  const tokenIdInternal = props.tokenId !== undefined ? BigInt(props.tokenId) : undefined;

  /** challenge details */
  const {
    refetch: refetchChallenge,
    data: _challengeRead,
    isLoading: isLoadingChallenge,
    isError: isErrorChallengeRead,
    error: errorChallengeRead,
  } = useContractRead({
    address: registryAddress,
    abi: RegistryAbi,
    functionName: 'getChallenge',
    args: tokenIdInternal ? [tokenIdInternal] : undefined,
    enabled: tokenIdInternal !== undefined,
  });

  const { data: totalVoters } = useContractRead({
    address: registryAddress,
    abi: RegistryAbi,
    functionName: 'getTotalVoters',
    args: tokenIdInternal ? [tokenIdInternal] : undefined,
    enabled: tokenIdInternal !== undefined,
  });

  const { config: configChallenge } = usePrepareContractWrite({
    address: registryAddress,
    abi: RegistryAbi,
    args: tokenIdInternal ? [tokenIdInternal] : undefined,
    functionName: 'challenge',
    onError(error) {
      console.log('Error', error);
    },
  });

  const {
    data: transaction,
    writeAsync: sendChallenge,
    isError: _isErrorWriting,
    error: _errorWriting,
  } = useContractWrite(configChallenge);

  const {
    isError: _isErrorWaiting,
    error: _errorWaiting,
    isSuccess,
  } = useWaitForTransaction({
    hash: transaction?.hash,
  });

  const isErrorSending = _isErrorWriting || _isErrorWaiting;
  const errorSending = _errorWriting ? _errorWriting : _errorWaiting ? _errorWaiting : null;

  /** can vote */
  const { aaAddress: connectedAddress } = useAccountContext();

  const { data: tokenIdOfAddress } = useContractRead({
    address: registryAddress,
    abi: RegistryAbi,
    functionName: 'tokenIdOf',
    args: connectedAddress ? [connectedAddress] : undefined,
    enabled: connectedAddress !== undefined,
  });

  const { data: canVote } = useContractRead({
    address: registryAddress,
    abi: RegistryAbi,
    functionName: 'canVote',
    args: tokenIdOfAddress && tokenIdInternal ? [tokenIdOfAddress, tokenIdInternal] : undefined,
    enabled: tokenIdOfAddress !== undefined && tokenIdInternal !== undefined,
  });

  const { data: _myVote } = useContractRead({
    address: registryAddress,
    abi: RegistryAbi,
    functionName: 'getChallengeVote',
    args: tokenIdOfAddress && tokenIdInternal ? [tokenIdInternal, tokenIdOfAddress] : undefined,
    enabled: tokenIdOfAddress !== undefined && tokenIdInternal !== undefined,
  });

  const myVote = _myVote !== undefined && _myVote !== 0 ? _myVote : undefined;

  /** Vote transactions */
  const voteRemove: [bigint, number] | undefined = tokenIdInternal !== undefined ? [tokenIdInternal, 1] : undefined;
  const voteKeep: [bigint, number] | undefined = tokenIdInternal !== undefined ? [tokenIdInternal, -1] : undefined;

  const { config: configVoteRemove } = usePrepareContractWrite({
    address: registryAddress,
    abi: RegistryAbi,
    args: voteRemove,
    functionName: 'vote',
    onError(error) {
      console.log('Error', error);
    },
  });

  const { config: configVoteKeep } = usePrepareContractWrite({
    address: registryAddress,
    abi: RegistryAbi,
    args: voteKeep,
    functionName: 'vote',
    onError(error) {
      console.log('Error', error);
    },
  });

  const {
    writeAsync: sendVoteRemove,
    data: voteRemoveTx,
    isError: _isErrorWritingVoteRemain,
    error: _errorWritingVoteRemain,
  } = useContractWrite(configVoteRemove);
  const {
    writeAsync: sendVoteKeep,
    data: voteKeepTx,
    isError: _isErrorWritingKeep,
    error: _errorWritingVoteKeep,
  } = useContractWrite(configVoteKeep);

  const voteHash = voteRemoveTx ? voteRemoveTx.hash : voteKeepTx ? voteKeepTx.hash : undefined;

  const {
    isError: _isErrorWaitingVote,
    error: _errorWaitingVote,
    isSuccess: isSuccessVote,
  } = useWaitForTransaction({
    hash: voteHash,
  });

  const _isErrorWritingVote = _isErrorWritingVoteRemain || _isErrorWritingKeep;
  const _errorWritingVote = _errorWritingVoteRemain
    ? _errorWritingVoteRemain
    : _errorWritingVoteKeep
    ? _errorWritingVoteRemain
    : undefined;

  const isErrorSendingVote = _isErrorWritingVote || _isErrorWaitingVote;
  const errorSendingVote = _errorWritingVote ? _errorWritingVote : _errorWaitingVote ? _errorWaitingVote : null;

  /** undefined means currently reading, null means read and not found */
  const challengeRead: AppChallenge | undefined | null = ((_challengeRead) => {
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
    <ChallengeContextValue.Provider
      value={{
        tokenId: Number(tokenIdInternal),
        sendChallenge,
        refetchChallenge,
        challengeRead,
        totalVoters: Number(totalVoters),
        isLoadingChallenge,
        canVote,
        myVote: myVote as VoteOption | undefined,
        sendVoteRemove,
        sendVoteKeep,
        isSuccess,
        isErrorSending,
        errorSending,
        isSuccessVote,
        isErrorSendingVote,
        errorSendingVote,
      }}>
      {props.children}
    </ChallengeContextValue.Provider>
  );
};

export const useCurrentChallenge = (): ChallengeContextType => {
  const context = useContext(ChallengeContextValue);
  if (!context) throw Error('context not found');
  return context;
};
