import { createPublicClient, getContract, http } from 'viem';
import { baseSepolia } from 'viem/chains';

import { env } from '../config/env';
import { registryABI, registryFactoryABI } from '../contracts/abis';
import { HexStr } from '../@app/types';

// const getFactoryAddress = () => _factoryAddress(env.CHAIN_ID);

export const chain = baseSepolia;

const publicClient = createPublicClient({
  chain,
  transport: http(
    `https://${env.ALCHEMY_SUBDOMAIN}.g.alchemy.com/v2/${env.ALCHEMY_KEY}`
  ),
});

const getRegistry = (address: HexStr) => {
  return getContract({
    address,
    abi: registryABI,
    client: publicClient,
  });
};

export { registryABI, registryFactoryABI, getRegistry, publicClient };
