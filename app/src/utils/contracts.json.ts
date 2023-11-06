/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import stringify from 'canonical-json';
import contractsJson from '../generated/contracts.json';
import { CHAIN_NAME, CHAIN_ID } from '../config/appConfig';
import { getContract } from 'viem';

function addressOnChain(chainId: number, contractName: string): `0x{string}` {
  const json = (contractsJson as any)[chainId.toString()];
  if (json === undefined) throw new Error(`JSON of chain ${chainId} not found`);

  const chainName = Object.getOwnPropertyNames(json);
  if (chainName.length === 0) throw new Error(`JSON of chain ${chainId} not found`);

  return json[chainName[0]]['contracts'][contractName].address;
}

const RegistryAbi = [
  {
    inputs: [],
    name: 'AccountAlreadyOwnsOneToken',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CantChallengeInvalidAccount',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ChallangeAlreadyActive',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ErrorAccountNotValid',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ErrorAccountSolidified',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ErrorAlreadyVoted',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ErrorChallangeAlreadyExecuted',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ErrorChallangeNotActive',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ErrorVoteNotFound',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ErrorVoteOnOwnChallenge',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ErrorVoterCantVote',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ErrorVoterValid',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ErrorVotingPeriodEnded',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ErrorVoucherIsValid',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ErrorVoucherNotValid',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'prod1',
        type: 'uint256',
      },
    ],
    name: 'PRBMath__MulDivFixedPointOverflow',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'prod1',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'denominator',
        type: 'uint256',
      },
    ],
    name: 'PRBMath__MulDivOverflow',
    type: 'error',
  },
  {
    inputs: [],
    name: 'UnexpectedExecutedCondition',
    type: 'error',
  },
  {
    inputs: [],
    name: 'VoucherNoLongerInvalid',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ChallengeEvent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'int8',
        name: 'outcome',
        type: 'int8',
      },
    ],
    name: 'ChallengeExecuted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'InvalidatedAccountEvent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'InvalidatedByChallenge',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'InvalidatedByInvalidVoucher',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'voterTokenId',
        type: 'uint256',
      },
    ],
    name: 'InvalidatedVoteEvent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'voterTokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'int8',
        name: 'vote',
        type: 'int8',
      },
    ],
    name: 'VoteEvent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newEndDate',
        type: 'uint256',
      },
    ],
    name: 'VotingPeriodExtendedEvent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'from',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'to',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'personCid',
        type: 'string',
      },
    ],
    name: 'VouchEvent',
    type: 'event',
  },
  {
    inputs: [],
    name: 'FOUNDERS_VOUCHER',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'PENDING_PERIOD',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'QUIET_ENDING_PERIOD',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'VOTING_PERIOD',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_nEntries',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'voterTokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'challengedTokenId',
        type: 'uint256',
      },
    ],
    name: 'canVote',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
    ],
    name: 'challenge',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
    ],
    name: 'executeVote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getAccount',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'voucher',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'valid',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'timesChallenged',
            type: 'uint256',
          },
        ],
        internalType: 'struct Registry.Account',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'getApproved',
    outputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getChallenge',
    outputs: [
      {
        internalType: 'uint256',
        name: 'creationDate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'endDate',
        type: 'uint256',
      },
      {
        internalType: 'int8',
        name: 'lastOutcome',
        type: 'int8',
      },
      {
        internalType: 'uint256',
        name: 'nVoted',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nFor',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'executed',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'voterTokenId',
        type: 'uint256',
      },
    ],
    name: 'getChallengeVote',
    outputs: [
      {
        internalType: 'int8',
        name: '',
        type: 'int8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'challengeIndex',
        type: 'uint256',
      },
    ],
    name: 'getSpecificChallenge',
    outputs: [
      {
        internalType: 'uint256',
        name: 'creationDate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'endDate',
        type: 'uint256',
      },
      {
        internalType: 'int8',
        name: 'lastOutcome',
        type: 'int8',
      },
      {
        internalType: 'uint256',
        name: 'nVoted',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nFor',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'executed',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'voterTokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'challengeIndex',
        type: 'uint256',
      },
    ],
    name: 'getSpecificChallengeVote',
    outputs: [
      {
        internalType: 'int8',
        name: '',
        type: 'int8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getTokenPersonCid',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getTokenVouch',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'personCid',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'vouchDate',
            type: 'uint256',
          },
        ],
        internalType: 'struct Registry.Vouch',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
    ],
    name: 'getTotalVoters',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'voucherTokenId',
        type: 'uint256',
      },
    ],
    name: 'getVoucherVouchesNumber',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '__symbol',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '__name',
        type: 'string',
      },
      {
        internalType: 'address[]',
        name: 'addresses',
        type: 'address[]',
      },
      {
        internalType: 'string[]',
        name: 'foundersCids',
        type: 'string[]',
      },
    ],
    name: 'initRegistry',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'invalidateInvalidVoucher',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_voterTokenId',
        type: 'uint256',
      },
    ],
    name: 'invalidateVote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'isSolidified',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'tokenIdOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
      {
        internalType: 'int8',
        name: '_vote',
        type: 'int8',
      },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'personCid',
        type: 'string',
      },
    ],
    name: 'vouch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

const RegistryFactoryAbi = [
  {
    inputs: [
      {
        internalType: 'address payable',
        name: '_master',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newRegistry',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'salt',
        type: 'bytes32',
      },
    ],
    name: 'RegistryCreated',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'salt',
        type: 'bytes32',
      },
    ],
    name: 'contractAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '__symbol',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '__name',
        type: 'string',
      },
      {
        internalType: 'address[]',
        name: 'addresses',
        type: 'address[]',
      },
      {
        internalType: 'string[]',
        name: 'foundersCids',
        type: 'string[]',
      },
      {
        internalType: 'bytes32',
        name: 'salt',
        type: 'bytes32',
      },
    ],
    name: 'create',
    outputs: [
      {
        internalType: 'address payable',
        name: 'proxy',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mrCounter',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const refAbi = stringify(((contractsJson as any)[CHAIN_ID.toString()][CHAIN_NAME]['contracts']['Registry'] as any).abi);
if (stringify(RegistryAbi) !== refAbi) {
  throw new Error('Unexpected ABI, manually updated it to be a const');
}

const refAbiFact = stringify(
  ((contractsJson as any)[CHAIN_ID.toString()][CHAIN_NAME]['contracts']['RegistryFactory'] as any).abi
);
if (stringify(RegistryFactoryAbi) !== refAbiFact) {
  throw new Error('Unexpected ABI, manually updated it to be a const');
}

const VouchEventAbi = {
  anonymous: false,
  inputs: [
    {
      indexed: true,
      internalType: 'uint256',
      name: 'from',
      type: 'uint256',
    },
    {
      indexed: true,
      internalType: 'uint256',
      name: 'to',
      type: 'uint256',
    },
    {
      indexed: false,
      internalType: 'string',
      name: 'personCid',
      type: 'string',
    },
  ],
  name: 'VouchEvent',
  type: 'event',
} as const;

const ChallengeEventAbi = {
  anonymous: false,
  inputs: [
    {
      indexed: true,
      internalType: 'uint256',
      name: 'tokenId',
      type: 'uint256',
    },
  ],
  name: 'ChallengeEvent',
  type: 'event',
} as const;

const registryFactoryAddress = addressOnChain(CHAIN_ID, 'RegistryFactory');

export { RegistryAbi, RegistryFactoryAbi, VouchEventAbi, ChallengeEventAbi, registryFactoryAddress };
