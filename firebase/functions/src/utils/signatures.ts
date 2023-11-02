import stringify from 'canonical-json';
import { utils } from 'ethers';
import { binary_to_base58 } from 'base58-js';
import { sha256 } from 'js-sha256';

import { SignedObject } from '../@app/types';
import { registry } from './contracts';

export const verifySignedObject = async <T>(
  signed: SignedObject<T>,
  tokenId: number
) => {
  const message = stringify(signed.object);
  const signer = utils.verifyMessage(message, signed.signature);
  const addressOfToken = await registry.ownerOf(tokenId);

  if (signer.toLowerCase() !== addressOfToken.toLowerCase()) {
    throw new Error(`Unexpected signer ${signer}, expected ${addressOfToken}`);
  }

  /** encode signature to use as statement id */
  const bytes = Uint8Array.from(Buffer.from(signed.signature.slice(2), 'hex'));

  const hash = await sha256(bytes);
  const encoded = binary_to_base58(hash);
  const id = encoded.slice(0, 24);

  return id;
};
