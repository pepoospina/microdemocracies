import { WagmiConfig } from 'wagmi';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';

import { baseSepolia } from 'wagmi/chains';

import { WALLETCONNECT_PROJECT_ID } from '../config/appConfig';

export const chain = baseSepolia;
const projectId = WALLETCONNECT_PROJECT_ID;

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const config = defaultWagmiConfig({
  chains: [chain],
  projectId: WALLETCONNECT_PROJECT_ID,
  metadata,
});

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: false,
});

export const ConnectedWallet = ({ children }: React.PropsWithChildren) => {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
};
