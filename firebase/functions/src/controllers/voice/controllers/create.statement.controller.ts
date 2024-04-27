import { BigNumber } from '@ethersproject/bignumber'
import { verifyProof } from '@semaphore-protocol/proof'
import { RequestHandler } from 'express'
import { logger } from 'firebase-functions/v1'

import { AppStatementCreate } from '../../../@shared/types'
import { getStatementId, getTreeId } from '../../../@shared/utils/identity.utils'
import { getWeek } from '../../../@shared/utils/statements.shared.utils'
import { existsStatementWithNullifierHash, getTree } from '../../../db/getters'
import { setStatement, setStatementReaction } from '../../../db/setters'
import { TREE_DEPTH } from '../../../utils/groups'
import { isValidReaction } from '../utils/validate.reaction'
import { statementValidationScheme } from './voice.schemas'

export const createStatementController: RequestHandler = async (request, response) => {
  try {
    const statementCreate = (await statementValidationScheme.validate(
      request.body,
    )) as AppStatementCreate

    /** the proof must be
     * - of a tree that is a tree of the project (can be an old one)
     * - valid proof
     */
    const treeId = getTreeId(
      statementCreate.projectId,
      statementCreate.statementProof.proof.merkleTreeRoot,
    )
    const tree = await getTree(treeId)

    if (!tree) {
      throw new Error(
        `Tree not found in project ${statementCreate.projectId} with root ${statementCreate.statementProof.proof}`,
      )
    }

    const week = getWeek(Date.now()).toString()

    /** Check period nullifier */
    const expectedExternalNullifier = BigNumber.from(week).toString()

    if (
      statementCreate.statementProof.proof.externalNullifier !== expectedExternalNullifier
    ) {
      throw new Error(
        `A statement nullifier in this period ${statementCreate.statementProof.proof.externalNullifier} must be ${expectedExternalNullifier}`,
      )
    }

    // verify statement proof
    const validStatement = await verifyProof(
      statementCreate.statementProof.proof,
      TREE_DEPTH,
    )

    if (!validStatement) {
      throw new Error('Invalid statement proof')
    }

    /** no previous statement with the same nullifierHash */
    const preExist = await existsStatementWithNullifierHash(
      statementCreate.statementProof.proof.nullifierHash,
    )
    if (preExist) {
      throw new Error(
        `Statement with this nullifierHash ${statementCreate.statementProof.proof.nullifierHash} already posted`,
      )
    }

    // verify reaction proof
    const statementId = getStatementId(statementCreate.statementProof.proof)
    const validReaction = await isValidReaction(
      statementCreate.reactionProof,
      statementId,
      statementCreate.statementProof.treeId,
    )

    if (!validReaction) {
      throw new Error('Invalid reaction proof')
    }

    const id = await setStatement({
      projectId: statementCreate.projectId,
      proof: statementCreate.statementProof.proof,
      statement: statementCreate.statement,
      treeId: treeId,
      createdAt: Date.now(),
    })

    await setStatementReaction({
      statementId: id,
      proof: statementCreate.reactionProof.proof,
    })

    response.status(200).send({ success: true, id })
  } catch (error: any) {
    logger.error('error', error)
    response.status(500).send({ success: false, error: error.message })
  }
}
