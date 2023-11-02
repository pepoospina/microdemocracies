import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

import { getDeployer } from '../utils/utils';
import { prepareFounders } from '../utils/prepare.founders';

global.ReadableStream = require('web-streams-polyfill').ReadableStream;

const deployEntryPoint: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await getDeployer(hre, 0);
  const founders = await prepareFounders();

  const ret = await hre.deployments.deploy('Registry', {
    from: deployer.address,
    args: ['NSR', 'Network Citizenship Registry', founders.addresses, founders.personsCids],
    gasLimit: 5e6,
    deterministicDeployment: true,
  });

  console.log('== Registry Address ==', ret.address);
};

export default deployEntryPoint;
