import { createPublicClient } from 'viem';
import { getContract } from 'viem';
import { baseGoerli } from 'viem/chains';

import contractsJson from '../generated/contracts.json';
import { env } from '../config/env';

function addressOnChain(chainId: number): `0x{string}` {
  const json = (contractsJson as any)[chainId.toString()];
  if (json === undefined) throw new Error(`JSON of chain ${chainId} not found`);

  const chainName = Object.getOwnPropertyNames(json);
  if (chainName.length === 0)
    throw new Error(`JSON of chain ${chainId} not found`);

  return json[chainName[0]]['contracts']['Registry'].address;
}
const registryAddress = addressOnChain(env.CHAIN_ID);

const publicClient = createPublicClient({
  chain: baseGoerli,
  transport: http('https://eth-mainnet.g.alchemy.com/v2/<apiKey>'),
});

const registry = getContract({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: wagmiAbi,
  publicClient,
});

export { registryAddress, registry };
