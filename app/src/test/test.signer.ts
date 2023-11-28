import { LocalAccountSigner, WalletClientSigner } from '@alchemy/aa-core';

export const createTestSigner = (ix: number) => {
  return LocalAccountSigner.mnemonicToAccountSigner(process.env.MNEMONIC) as unknown as WalletClientSigner;
};
