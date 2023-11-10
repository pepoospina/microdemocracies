/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { CHAIN_ID } from '../config/appConfig';
import { registryABI, registryFactoryABI } from '../contracts/abis';

async function _factoryAddress(chainId: number): Promise<`0x{string}`> {
  const json = await import(`../contracts/deployments/chain-${chainId}/deployed_addresses.json`);
  if (json === undefined) throw new Error(`JSON of chain ${chainId} not found`);

  return json['RegistryFactory#RegistryFactory'];
}

const getFactoryAddress = () => _factoryAddress(CHAIN_ID);

export { registryABI, registryFactoryABI, getFactoryAddress };
