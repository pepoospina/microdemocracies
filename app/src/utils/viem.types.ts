import { decodeEventLog } from 'viem';

import { registryFactoryABI } from './contracts.json';

export type RegistryCreatedEvent = Awaited<
  ReturnType<typeof decodeEventLog<typeof registryFactoryABI, 'RegistryCreated'>>
>;
