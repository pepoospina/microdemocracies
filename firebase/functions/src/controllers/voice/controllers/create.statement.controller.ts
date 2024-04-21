import { RequestHandler } from 'express';
import { verifyProof } from '@semaphore-protocol/proof';
import { logger } from 'firebase-functions/v1';

import { AppStatementCreate } from '../../../@app/types';

import { TREE_DEPTH } from '../../../utils/groups';
import { setStatement } from '../../../db/setters';
import { getTree } from '../../../db/getters';
import { getStatementId, getTreeId } from '../../../@app/utils/identity.utils';

import { statementValidationScheme } from './voice.schemas';
import { isValidReaction } from '../utils/validate.reaction';

export const createStatementController: RequestHandler = async (
  request,
  response
) => {
  const statement = (await statementValidationScheme.validate(
    request.body
  )) as AppStatementCreate;

  /** the proof must be
   * - of a tree that is a tree of the project (can be an old one)
   * - valid proof
   */
  const treeId = getTreeId(statement.projectId, statement.statementProof.proof.merkleTreeRoot)
  const tree = await getTree(treeId);

  if (!tree) {
    throw new Error(
      `Tree not found in project ${statement.projectId} with root ${statement.statementProof.proof}`
    );
  }

  // verify statement proof
  const validStatement = await verifyProof(statement.statementProof.proof, TREE_DEPTH);

  if (!validStatement) {
    throw new Error('Invalid statement proof');
  }

  // verify reaction proof
  const statementId = getStatementId(statement.statementProof.proof);
  const validReaction = await isValidReaction(statement.reactionProof,statementId, statement.statementProof.treeId);

  if (!validReaction) {
    throw new Error('Invalid reaction proof');
  }

  try {
    const id = await setStatement(statement);
    response.status(200).send({ success: true, id });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
