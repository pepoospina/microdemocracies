import { createConfig, http } from 'wagmi';

import { ALCHEMY_KEY } from './config/appConfig';

import { baseSepolia } from 'wagmi/chains';

// const { publicClient, webSocketPublicClient } = configureChains([CHAIN], [alchemyProvider({ apiKey: ALCHEMY_KEY })]);

export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(
      `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`
    ),
  },
});
