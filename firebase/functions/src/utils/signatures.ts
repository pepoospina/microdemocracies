import stringify from 'canonical-json';
import { binary_to_base58 } from 'base58-js';
import { sha256 } from 'js-sha256';

import { SignedObject } from '../@app/types';
import { publicClient, registry } from './contracts';

export const verifySignedObject = async <T>(
  signed: SignedObject<T>,
  tokenId: number
) => {
  const message = stringify(signed.object);
  const addressOfToken = await registry.read.ownerOf([BigInt(tokenId)]);
  const valid = await publicClient.verifyMessage({
    address: addressOfToken,
    message,
    signature: signed.signature,
  });

  if (!valid) {
    throw new Error(`Invalid signer expected ${addressOfToken}`);
  }

  /** encode signature to use as statement id */
  const bytes = Uint8Array.from(Buffer.from(signed.signature.slice(2), 'hex'));

  const hash = await sha256(bytes);
  const encoded = binary_to_base58(hash);
  const id = encoded.slice(0, 24);

  return id;
};
