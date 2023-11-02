import { LogDescription } from '@ethersproject/abi';
import { BigNumber, Contract, Signer, Event } from 'ethers';
import { ethers } from 'hardhat';
import { Registry, Registry__factory } from 'typechain';

export const numOf = (str: string): string => {
  return str.replace(/\s/g, '');
};

export const toWei = (str: string): BigNumber => {
  return ethers.utils.parseEther(numOf(str));
};

export const toBigNumber = (num: string, decimals: number): BigNumber => {
  return ethers.utils.parseUnits(num, decimals);
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

export async function getTimestamp(block?: string): Promise<BigNumber> {
  return ethers.BigNumber.from((await ethers.provider.getBlock(block == undefined ? 'latest' : block)).timestamp);
}

export async function fastForwardFromBlock(block: string, seconds: BigNumber): Promise<void> {
  const now = await getTimestamp();
  const timeSinceTimemark = now.sub(await getTimestamp(block));
  const fastforwardAmount = seconds.sub(timeSinceTimemark);
  await ethers.provider.send('evm_increaseTime', [fastforwardAmount.toNumber()]);
  await ethers.provider.send('evm_mine', []);
}

export async function fastForwardToTimestamp(toTimestamp: BigNumber): Promise<void> {
  const now = await getTimestamp();
  const fastforwardAmount = toTimestamp.sub(now);
  await ethers.provider.send('evm_increaseTime', [fastforwardAmount.toNumber()]);
  await ethers.provider.send('evm_mine', []);
}

export const deployRegistry = async (addresses: string[], personsCids: string[], signer: Signer): Promise<Registry> => {
  const deployer = await ethers.getContractFactory<Registry__factory>('Registry', signer);
  const registry = await deployer.deploy('NSR', 'NetworkState Registry', addresses, personsCids);
  return await registry.deployed();
};

export const getDeployEvents = async (contract: Contract): Promise<LogDescription[]> => {
  const receipt = await ethers.provider.getTransactionReceipt(contract.deployTransaction.hash);
  const events = receipt.logs
    .map((log) => {
      try {
        return contract.interface.parseLog(log);
      } catch (error) {
        return null;
      }
    })
    .filter((event) => event !== null);

  return events as LogDescription[];
};

export const registryFrom = (address: string, signer: Signer): Registry => {
  return Registry__factory.connect(address, signer);
};

export const ZERO_BYTES = '0x0000000000000000000000000000000000000000000000000000000000000000';
export const SECONDS_IN_WEEK = 604800;
export const SECONDS_IN_DAY = 86400;
