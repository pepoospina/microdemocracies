import { createPublicClient, getContract, http } from 'viem';
import { baseGoerli } from 'viem/chains';

import { env } from '../config/env';
import { registryABI, registryFactoryABI } from '../contracts/abis';
import { HexStr } from 'src/@app/types';

// const getFactoryAddress = () => _factoryAddress(env.CHAIN_ID);
const getFactoryAddress = (): HexStr =>
  '0x2b18D3657f4B4129B36D74BCF5B2889C91fBa252';

const publicClient = createPublicClient({
  chain: baseGoerli,
  transport: http(`https://eth-mainnet.g.alchemy.com/v2/${env.ALCHEMY_KEY}`),
});

const registry = getContract({
  address: getFactoryAddress(),
  abi: registryABI,
  publicClient,
});

export {
  registryABI,
  registryFactoryABI,
  getFactoryAddress,
  registry,
  publicClient,
};
