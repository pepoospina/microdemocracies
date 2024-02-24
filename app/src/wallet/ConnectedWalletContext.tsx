import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { WagmiProvider } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

import { WALLETCONNECT_PROJECT_ID } from '../config/appConfig';

export const chain = baseSepolia;

const projectId = WALLETCONNECT_PROJECT_ID;

const metadata = {
  name: 'Micro-Democracies',
  description: 'Connect to Microdemocracies',
  url: 'http://localhost:3000/', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const config = defaultWagmiConfig({
  chains: [chain],
  projectId,
  metadata,
});

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: false,
});

const queryClient = new QueryClient();

export const ConnectedWallet = ({ children }: React.PropsWithChildren) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
