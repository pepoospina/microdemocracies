import { localhost } from 'wagmi/chains';
import { configureChains, createConfig } from 'wagmi';
// import { alchemyProvider } from 'wagmi/providers/alchemy';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

// const { publicClient, webSocketPublicClient } = configureChains([CHAIN], [alchemyProvider({ apiKey: ALCHEMY_KEY })]);
const { publicClient, webSocketPublicClient } = configureChains(
  [localhost],
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
