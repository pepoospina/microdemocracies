import '@nomiclabs/hardhat-waffle';
import '@tenderly/hardhat-tenderly';
import 'hardhat-deploy';

import { HardhatRuntimeEnvironment } from 'hardhat/types';
import 'hardhat-deploy/src/type-extensions';

export type { HardhatRuntimeEnvironment as HardhatRuntimeEnvironmentExtended };
