import { configureChains, createConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { ALCHEMY_KEY, MAGIC_API_KEY } from '../config/appConfig';
import { chain } from './config';

// const { publicClient, webSocketPublicClient } = configureChains([CHAIN], [alchemyProvider({ apiKey: ALCHEMY_KEY })]);
const { publicClient, webSocketPublicClient, chains } = configureChains(
  [chain],
  [alchemyProvider({ apiKey: ALCHEMY_KEY })]
);

export const config = createConfig({
  publicClient,
  webSocketPublicClient,
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
});
