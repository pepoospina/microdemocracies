import { createWalletClient, custom } from 'viem';
import { WalletClientSigner } from '@alchemy/aa-core';

import { chain } from './config';

export const createInjectedSigner = () => {
  const client = createWalletClient({
    chain,
    transport: custom((window as any).ethereum),
  });

  return new WalletClientSigner(client as any, 'json-rpc');
};
