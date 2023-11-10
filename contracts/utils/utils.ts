import { viem } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Signer } from 'test/viem.types';
import { PublicClient } from 'viem';

export const getDeployEnv = async (): Promise<{
  deployer: Signer;
  client: PublicClient;
}> => {
  const signers = await viem.getWalletClients();
  const client = await viem.getPublicClient();

  const deployer = signers[0];

  return {
    deployer,
    client,
  };
};
