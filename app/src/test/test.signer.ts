import { mnemonic } from './.mnemonic';

import { LocalAccountSigner, WalletClientSigner } from '@alchemy/aa-core';

export const createTestSigner = (ix: number) => {
  return LocalAccountSigner.mnemonicToAccountSigner(mnemonic) as unknown as WalletClientSigner;
};
