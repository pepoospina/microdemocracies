import { artifacts, viem } from 'hardhat';
import { parseEther, parseUnits, TransactionReceipt, decodeEventLog } from 'viem';

import { EventType, Registry, RegistryFactory, Signer, TransferEventType, VouchEventType } from './viem.types';
import { Entity, HexStr, PAP } from '@app/types';

export interface User {
  s: Signer;
  tokenId: bigint;
  person: Entity<PAP>;
}

export const numOf = (str: string): string => {
  return str.replace(/\s/g, '');
};

export const toWei = (str: string) => {
  return parseEther(numOf(str));
};

export const toBigInt = (num: string, decimals: number) => {
  return parseUnits(num, decimals);
};

export const shouldFail = async (fun: () => any, expectedMsg?: string): Promise<void> => {
  const FAIL = 'function execution did not failed';
  try {
    await fun();
    throw new Error(FAIL);
  } catch (e: any) {
    const msg = e.message as string;
    if (msg == FAIL) {
      throw new Error(FAIL);
    }
    if (expectedMsg !== undefined && !msg.includes(expectedMsg)) {
      throw new Error(`unexpected error message. Received: "${msg}" - Expected: "${expectedMsg}"`);
    } else {
      return;
    }
  }
};

export async function getTimestamp(blockHash?: HexStr) {
  const client = await viem.getPublicClient();
  const block = await client.getBlock(blockHash === undefined ? { blockTag: 'latest' } : { blockHash });
  return block.timestamp;
}

export async function fastForwardFromBlock(blockHash: HexStr, seconds: bigint): Promise<void> {
  const client = await viem.getTestClient();
  const now = await getTimestamp();
  const timeSinceTimemark = now - (await getTimestamp(blockHash));
  const fastforwardAmount = seconds - timeSinceTimemark;
  await client.increaseTime({ seconds: Number(fastforwardAmount) });
  await client.mine({ blocks: 1 });
}

export async function fastForwardToTimestamp(toTimestamp: bigint): Promise<void> {
  const client = await viem.getTestClient();
  const now = await getTimestamp();
  const fastforwardAmount = toTimestamp - now;
  await client.increaseTime({ seconds: Number(fastforwardAmount) });
  await client.mine({ blocks: 1 });
}

export const deployRegistry = async (signer: Signer): Promise<Registry> => {
  return viem.deployContract('Registry', []) as unknown as Registry;
};

export const deployRegistryFactory = async (masterAddress: string, signer: Signer): Promise<RegistryFactory> => {
  return viem.deployContract('RegistryFactory', [masterAddress], { walletClient: signer }) as unknown as RegistryFactory;
};

export const getContractEventsFromHash = async (contractName: string, hash: HexStr): Promise<EventType[]> => {
  const client = await viem.getPublicClient();
  const receipt = await client.waitForTransactionReceipt({ hash });
  return getContractEventsFromReceipt(contractName, receipt);
};

export const getContractEventsFromReceipt = async (contractName: string, rec: TransactionReceipt): Promise<EventType[]> => {
  const factoryArtifact = await artifacts.readArtifact(contractName);
  if (!rec.logs) return [];
  const events = rec.logs
    .map((log) => {
      try {
        const event = decodeEventLog({
          abi: factoryArtifact.abi,
          data: log.data,
          topics: log.topics,
          strict: false,
        });
        return event;
      } catch (e) {
        return undefined;
      }
    })
    .filter((e) => e !== undefined);

  return events as unknown as EventType[];
};

export const vouchHelper = async (registryAddress: HexStr, by: User, vouched: User) => {
  const registry = await registryFrom(registryAddress, by.s);
  const tx = await registry.write.vouch([vouched.s.account.address, vouched.person.cid]);
  const client = await viem.getPublicClient();
  const receipt = await client.waitForTransactionReceipt({ hash: tx });
  const events = await getContractEventsFromReceipt('Registry', receipt);

  const vouchEvent = events.find((e) => e.eventName === 'VouchEvent') as VouchEventType | undefined;
  const transferEvent = events.find((e) => e.eventName === 'Transfer') as TransferEventType | undefined;

  /** store the tokenId in the User object */
  if (transferEvent) {
    vouched.tokenId = transferEvent?.args?.tokenId;
  }

  return { vouchEvent, transferEvent, tokenId: vouched.tokenId, receipt };
};

export const voteHelper = async (registryAddress: HexStr, by: User, challengedTokenId: bigint, vote: 1 | -1) => {
  const registry = await registryFrom(registryAddress, by.s);
  const tx = await registry.write.vote([challengedTokenId, vote]);
  const client = await viem.getPublicClient();
  const receipt = await client.waitForTransactionReceipt({ hash: tx });
  const events = await getContractEventsFromReceipt('Registry', receipt);

  const voteEvent = events.find((e) => e.eventName === 'VoteEvent');
  const invalidatedByChallengeEvent = events.find((e) => e.eventName === 'InvalidatedByChallenge');
  const invalidatedByInvalidVoucherEvent = events.find((e) => e.eventName === 'InvalidatedByInvalidVoucherEvent');
  const invalidatedAccountEvent = events.find((e) => e.eventName === 'InvalidatedAccountEvent');
  const votingPeriodExtendedEvent = events.find((e) => e.eventName === 'VotingPeriodExtendedEvent');
  const challengeExecuted = events.find((e) => e.eventName === 'ChallengeExecuted');

  return {
    voteEvent,
    invalidatedAccountEvent,
    invalidatedByChallengeEvent,
    invalidatedByInvalidVoucherEvent,
    votingPeriodExtendedEvent,
    challengeExecuted,
    receipt,
  };
};

export const challengeHelper = async (registryAddress: HexStr, by: User, challengedTokenId: bigint) => {
  const registry = await registryFrom(registryAddress, by.s);

  const tx = await registry.write.challenge([challengedTokenId]);
  const events = await getContractEventsFromHash('Registry', tx);

  return events.find((e) => e.eventName === 'ChallengeEvent');
};

export const getChallengeParse = (returned: Awaited<ReturnType<Registry['read']['getChallenge']>>) => {
  return {
    creationDate: returned[0],
    endDate: returned[1],
    lastOutcome: returned[2],
    nVoted: returned[3],
    nFor: returned[4],
    executed: returned[5],
  };
};

export const personCidHelper = async (registry: Registry, tokenId: bigint) => {
  const { personCid } = await registry.read.getTokenVouch([tokenId]);
  return personCid;
};

export const registryFrom = (address: HexStr, signer: Signer): Promise<Registry> => {
  return viem.getContractAt('Registry', address, { walletClient: signer }) as unknown as Promise<Registry>;
};

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const ZERO_BYTES = '0x0000000000000000000000000000000000000000000000000000000000000000';
export const SECONDS_IN_WEEK = 604800;
export const SECONDS_IN_DAY = 86400;
export const SECONDS_IN_HOUR = 3600;
