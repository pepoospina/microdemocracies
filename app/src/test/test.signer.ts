import { createWalletClient, http } from 'viem';
import { mnemonicToAccount } from 'viem/accounts';

import { chain } from '../wallet/config';

import { mnemonic, ALCHEMY_SUBDOMAIN } from './.mnemonic';
import { ALCHEMY_KEY } from '../config/appConfig';
import { WalletClientSigner } from '@alchemy/aa-core';

export const createTestSigner = (ix: number) => {
  const account = mnemonicToAccount(mnemonic, { accountIndex: ix });

  const client = createWalletClient({
    account,
    chain,
    transport: http(`https://${ALCHEMY_SUBDOMAIN}.g.alchemy.com/v2/${ALCHEMY_KEY}`),
  });

  return new WalletClientSigner(client as any, 'json-rpc');
};
