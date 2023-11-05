import { goerli } from 'wagmi/chains';
import { configureChains, createConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { ALCHEMY_KEY, MAGIC_API_KEY } from '../config/appConfig';
import { DedicatedWalletConnector } from '@magiclabs/wagmi-connector';

// const { publicClient, webSocketPublicClient } = configureChains([CHAIN], [alchemyProvider({ apiKey: ALCHEMY_KEY })]);
const { publicClient, webSocketPublicClient, chains } = configureChains(
  [goerli],
  [alchemyProvider({ apiKey: ALCHEMY_KEY })]
);

export const config = createConfig({
  publicClient,
  webSocketPublicClient,
  connectors: [
    new DedicatedWalletConnector({
      chains,
      options: {
        apiKey: MAGIC_API_KEY,
        oauthOptions: {
          providers: ['facebook', 'google', 'twitter'],
          callbackUrl: 'https://your-callback-url.com', //optional
        },
        /* Make sure to enable OAuth options from magic dashboard */
        magicSdkConfiguration: {
          network: {
            rpcUrl: 'https://rpc.ankr.com/eth_goerli',
            chainId: 5,
          },
        },
      },
    }),
  ],
});
