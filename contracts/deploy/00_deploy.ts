import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

import { getDeployer } from '../utils/utils';
import { prepareFounders } from '../utils/prepare.founders';

const deployEntryPoint: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await getDeployer(hre, 0);
  const founders = await prepareFounders();

  const master = await hre.deployments.deploy('Registry', {
    from: deployer.address,
    args: [],
    log: true,
  });

  const res = await hre.deployments.deploy('RegistryFactory', {
    from: deployer.address,
    args: [master.address],
    log: true,
  });

  console.log('== RegistryFactory Address ==', res.address);
};

export default deployEntryPoint;
