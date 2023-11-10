import { PublicClient, Account, Chain, Transport, WalletClient, Log, decodeEventLog, GetContractReturnType } from 'viem';

import { registryFactoryABI, registryABI } from '../build/abis';

export type TransactionReceipt = Awaited<ReturnType<PublicClient['waitForTransactionReceipt']>>;
export type Signer = WalletClient<Transport, Chain, Account>;

export type RegistryFactory = GetContractReturnType<typeof registryFactoryABI, PublicClient, Signer>;
export type Registry = GetContractReturnType<typeof registryABI, PublicClient, Signer>;

export type EventType = Awaited<ReturnType<typeof decodeEventLog>>;
export type TransferEventType = Awaited<ReturnType<typeof decodeEventLog<typeof registryABI, 'Transfer'>>>;
export type VouchEventType = Awaited<ReturnType<typeof decodeEventLog<typeof registryABI, 'VouchEvent'>>>;
export type RegistryCreatedEvent = Awaited<ReturnType<typeof decodeEventLog<typeof registryFactoryABI, 'RegistryCreated'>>>;
