import { RequestHandler } from 'express';
import { verifyProof } from '@semaphore-protocol/proof';
import { logger } from 'firebase-functions/v1';

import { AppStatementCreate } from '../../../@app/types';

import { TREE_DEPTH } from '../../../utils/groups';
import { setStatement } from '../../../db/setters';
import { getTree } from '../../../db/getters';
import { getTreeId } from '../../../@app/utils/identity.utils';

import { statementValidationScheme } from './voice.schemas';

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
  const tree = await getTree(
    getTreeId(statement.projectId, statement.proof.merkleTreeRoot)
  );

  if (!tree) {
    throw new Error(
      `Tree not found in project ${statement.projectId} with root ${statement.proof}`
    );
  }

  const result = await verifyProof(statement.proof, TREE_DEPTH);

  if (!result) {
    throw new Error('Invalid proof');
  }

  try {
    const id = await setStatement(statement);
    response.status(200).send({ success: true, id });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
