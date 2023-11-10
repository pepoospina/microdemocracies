import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { viem } from 'hardhat';

import { getDeployEnv } from '../utils/utils';

const deployEntryPoint: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await getDeployEnv();

  const master = await viem.deployContract('Registry', [], { walletClient: deployer });
  const factory = await viem.deployContract('RegistryFactory', [master.address], { walletClient: deployer });

  console.log('== RegistryFactory Address ==', factory.address);
};

export default deployEntryPoint;
