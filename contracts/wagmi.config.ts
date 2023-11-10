import { defineConfig } from '@wagmi/cli';
import { hardhat } from '@wagmi/cli/plugins';

export default defineConfig({
  out: 'generated/abis.ts',
  contracts: [],
  plugins: [
    hardhat({
      artifacts: 'generated/artifacts/',
      project: '.',
    }),
  ],
});
