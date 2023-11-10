import { defineConfig } from '@wagmi/cli';
import { hardhat } from '@wagmi/cli/plugins';

export default defineConfig({
  out: 'export/abis.ts',
  contracts: [],
  plugins: [
    hardhat({
      artifacts: 'build/artifacts/',
      project: '.',
    }),
  ],
});
