import { BigNumber } from '@ethersproject/bignumber';
import {
    hasBackingWithNullifierHash,
  } from '../../../db/getters';
import { ProofAndTree } from '../../../@app/utils/identity';
import { getReactionNullifier } from '../../../@app/utils/identity.utils';
import { verifyProof } from '@semaphore-protocol/proof';
import { TREE_DEPTH } from '../../../utils/groups';

/** the reaction must have
 * - a proof of the same tree as the statement
 * - a nullifier that is the statementId
 * - no previous backing with the same nullifierHash
 * - a valid proof
 * - a signal that is the statementId
 *
 * also check the tree is stored (this should always be the case)
 */
export const isValidReaction = async (proofAndTree: ProofAndTree, statementId: string, expectedTreeId: string) => {
    if (proofAndTree.treeId !== expectedTreeId) {
        throw new Error(
          `Tree id of the statment ${expectedTreeId} is not the same as the treeId of that of the proof ${proofAndTree.treeId}`
        );
      }
       
      /** a nullifier that is the statementId */
      const expectedExternalNullifier = BigNumber.from(getReactionNullifier(statementId)).toString();

      if (proofAndTree.proof.externalNullifier !== expectedExternalNullifier) {
        throw new Error(
          `Backing signal nullifier ${proofAndTree.proof.externalNullifier} must be the statement id ${statementId}`
        );
      }
  
      /** no previous backing with the same nullifierHash */
      const preExist = await hasBackingWithNullifierHash(
        statementId,
        proofAndTree.proof.nullifierHash
      );
      if (preExist) {
        throw new Error(
          `Backing with this nullifierHash ${proofAndTree.proof.nullifierHash} already posted`
        );
      }
  
      /** a valid proof */
      const result = await verifyProof(proofAndTree.proof, TREE_DEPTH);
  
      if (!result) {
        throw new Error('Invalid proof');
      }

      return true;
}