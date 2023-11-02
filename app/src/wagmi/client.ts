import { configureChains, createConfig } from 'wagmi';
// import { alchemyProvider } from 'wagmi/providers/alchemy';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

import { CHAIN, ALCHEMY_KEY } from '../config/appConfig';

// const { publicClient, webSocketPublicClient } = configureChains([CHAIN], [alchemyProvider({ apiKey: ALCHEMY_KEY })]);
const { publicClient, webSocketPublicClient } = configureChains(
  [CHAIN],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        return { http: 'http://localhost:8545' };
      },
    }),
  ]
);

export const config = createConfig({
  publicClient,
  webSocketPublicClient,
});
