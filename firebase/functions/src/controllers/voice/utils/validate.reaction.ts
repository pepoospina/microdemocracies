import { BigNumber } from '@ethersproject/bignumber';
import {
    hasBackingWithNullifierHash,
  } from '../../../db/getters';
import { SemaphoreProofStrings } from 'src/@app/types';

/** the reaction must have
 * - a proof of the same tree as the statement
 * - a nullifier that is the statementId
 * - no previous backing with the same nullifierHash
 * - a valid proof
 * - a signal that is the statementId
 *
 * also check the tree is stored (this should always be the case)
 */
export const isValidReaction = async (proof: SemaphoreProofStrings, statementId: string, expectedTreeId: string) => {
    if (proof.treeId !== expectedTreeId) {
        throw new Error(
          `Tree id of the statment ${expectedTreeId} is not the same as the treeId of that of the proof ${proof.treeId}`
        );
      }
       
      /** a nullifier that is the statementId */
      const expectedNullifier = BigNumber.from(backing.statementId).toString();

      if (proofAndTree.proof.externalNullifier !== expectedNullifier) {
        throw new Error(
          `Backing signal nullifier ${backing.proof.nullifierHash} must be the statement id ${backing.statementId}`
        );
      }
  
      /** no previous backing with the same nullifierHash */
      const preExist = await hasBackingWithNullifierHash(
        backing.statementId,
        backing.proof.nullifierHash
      );
      if (preExist) {
        throw new Error(
          `Backing with this nullifierHash ${backing.proof.nullifierHash} already posted`
        );
      }
  
      /** a valid proof */
      const result = await verifyProof(backing.proof, TREE_DEPTH);
  
      if (!result) {
        throw new Error('Invalid proof');
      }
}