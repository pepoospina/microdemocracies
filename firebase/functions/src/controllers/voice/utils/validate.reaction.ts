import { BigNumber } from '@ethersproject/bignumber'
import { verifyProof } from '@semaphore-protocol/proof'

import { ProofAndTree } from '../../../@shared/types'
import { getReactionScope } from '../../../@shared/utils/identity.utils'
import { hasBackingWithNullifierHash } from '../../../db/getters'

/** the reaction must have
 * - a proof of the same tree as the statement
 * - a nullifier that is the statementId
 * - no previous backing with the same nullifier
 * - a valid proof
 * - a signal that is the statementId
 *
 * also check the tree is stored (this should always be the case)
 */
export const isValidReaction = async (
  proofAndTree: ProofAndTree,
  statementId: string,
  expectedTreeId: string,
) => {
  if (proofAndTree.treeId !== expectedTreeId) {
    throw new Error(
      `Tree id of the statment ${expectedTreeId} is not the same as the treeId of that of the proof ${proofAndTree.treeId}`,
    )
  }

  /** a nullifier that is the statementId */
  const expectedScope = BigNumber.from(getReactionScope(statementId)).toString()

  if (proofAndTree.proof.scope !== expectedScope) {
    throw new Error(
      `Backing signal nullifier ${proofAndTree.proof.scope} must be the statement id ${statementId}`,
    )
  }

  /** no previous backing with the same nullifierHash */
  const preExist = await hasBackingWithNullifierHash(
    statementId,
    proofAndTree.proof.nullifier,
  )
  if (preExist) {
    throw new Error(
      `Backing with this nullifier ${proofAndTree.proof.nullifier} already posted`,
    )
  }

  /** a valid proof */
  const result = await verifyProof(proofAndTree.proof)

  if (!result) {
    throw new Error('Invalid proof')
  }

  return true
}
