import { Identity } from '@semaphore-protocol/identity'
import { SemaphoreProof, generateProof as _generateProof } from '@semaphore-protocol/proof'
import { getPublicIdentity } from '../firestore/getters'

import { AppGetProof, AppPublicIdentity, HexStr } from '../types'

import { getMerklePass, postIdentity } from './statements'
import { getControlMessage } from './identity.utils'

export type MessageSigner = (message: string) => Promise<HexStr>

export interface ProofAndTree {
  proof: SemaphoreProof
  treeId: string
}

export const checkOrStoreId = async (
  publicId: string,
  owner: HexStr,
  aaAddress: HexStr,
  signMessage: MessageSigner,
) => {
  // check identity on DB
  const identity = await getPublicIdentity(owner)

  // if not found, store the identity
  if (identity === undefined) {
    const signature = await signMessage(getControlMessage(publicId))
    const details: AppPublicIdentity = {
      owner,
      publicId,
      aaAddress,
      signature,
    }

    await postIdentity(details)
  }
}

export const connectIdentity = async (owner: HexStr, aaAddress: HexStr, signMessage: MessageSigner) => {
  const secret = await signMessage('Prepare anonymous identity')
  const identity = new Identity(secret)
  const _publicId = identity.getCommitment().toString()

  // make sure the identity is stored in the DB
  await checkOrStoreId(_publicId, owner, aaAddress, signMessage)

  return identity
}

export const generateProof = async (input: AppGetProof & { identity: Identity }): Promise<ProofAndTree> => {
  const { projectId, treeId, identity, signal, nullifier } = input

  /**
   * Get the merkle pass as computed by the backend. It builds a tree
   * with the current list of project members and return the merkle pass
   * and the tree id (root)
   */
  const treePass = await getMerklePass({
    projectId,
    treeId,
    publicId: identity.getCommitment().toString(),
  })

  /** Based on this tree, a proof is generated here in the frontend */
  const generated = await _generateProof(identity, treePass.merklePass, nullifier, signal)

  /** Return the generated proof and the associated tree root */
  return { proof: generated, treeId: treePass.treeId }
}
