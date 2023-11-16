import { Identity } from '@semaphore-protocol/identity';
import { generateProof as _generateProof } from '@semaphore-protocol/proof';

import { getPublicIdentity } from '../firestore/getters';
import { AppPublicIdentity, HexStr } from '../types';
import { getMerklePass, postIdentity } from './statements';
import { getControlMessage } from './identity.basic';

export type MessageSigner = (input: { message: string }) => Promise<HexStr>;

export const checkOrStoreId = async (
  publicId: string,
  owner: HexStr,
  aaAddress: HexStr,
  signMessage: MessageSigner
) => {
  // check identity on DB
  const identity = await getPublicIdentity(owner);

  // if not found, store the identity
  if (identity === undefined) {
    const signature = await signMessage({
      message: getControlMessage(publicId),
    });
    const details: AppPublicIdentity = {
      owner,
      publicId,
      aaAddress,
      signature,
    };

    await postIdentity(details);
  }
};

export const connectIdentity = async (owner: HexStr, aaAddress: HexStr, signMessage: MessageSigner) => {
  const secret = await signMessage({ message: 'Prepare anonymous identity' });
  const identity = new Identity(secret);
  const _publicId = identity.getCommitment().toString();

  // make sure the identity is stored in the DB
  await checkOrStoreId(_publicId, owner, aaAddress, signMessage);

  return identity;
};

export const generateProof = async (
  identity: Identity,
  projectId: number,
  publicId: string,
  signal: string,
  nullifier: string
) => {
  const merklePass = await getMerklePass({
    projectId,
    publicId,
  });
  const generated = await _generateProof(identity, merklePass, nullifier, signal);
  return generated.proof.toString();
};
