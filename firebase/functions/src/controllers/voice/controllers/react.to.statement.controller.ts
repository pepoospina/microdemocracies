import { RequestHandler } from 'express'
import { logger } from 'firebase-functions/v1'

import { AppReactionCreate } from '../../../@shared/types'
import { getTreeId } from '../../../@shared/utils/identity.utils'
import { getStatement, getTree } from '../../../db/getters'
import { setStatementReaction } from '../../../db/setters'
import { isValidReaction } from '../utils/validate.reaction'
import { backStatementValidationScheme } from './voice.schemas'

export const reactToStatementController: RequestHandler = async (request, response) => {
  try {
    const reaction = (await backStatementValidationScheme.validate(
      request.body,
    )) as AppReactionCreate

    /** a proof of the same tree as the statement */
    const statement = await getStatement(reaction.statementId)
    const proofTreeId = getTreeId(statement.projectId, statement.proof.merkleTreeRoot)

    const tree = await getTree(proofTreeId)
    if (!tree) {
      throw new Error(`Three with id ${proofTreeId} not found`)
    }

    const isValid = await isValidReaction(
      { proof: reaction.proof, treeId: tree.id },
      reaction.statementId,
      proofTreeId,
    )
    if (!isValid) {
      throw new Error('Invalid backing')
    }

    await setStatementReaction(reaction)
    response.status(200).send({ success: true })
  } catch (error: any) {
    logger.error('error', error)
    response.status(500).send({ success: false, error: error.message })
  }
}
