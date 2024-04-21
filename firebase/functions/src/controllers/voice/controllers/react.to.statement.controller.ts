import { RequestHandler } from 'express';
import { logger } from 'firebase-functions/v1';

import { AppReactionCreate } from '../../../@app/types';
import { getTreeId } from '../../../@app/utils/identity.utils';
import { getStatement, getTree } from '../../../db/getters';
import { setStatementBacker } from '../../../db/setters';

import { backStatementValidationScheme } from './voice.schemas';

import { isValidReaction } from '../utils/validate.reaction';

export const reactToStatementController: RequestHandler = async (
  request,
  response
) => {
  try {
    const backing = (await backStatementValidationScheme.validate(
      request.body
    )) as AppReactionCreate;

    /** the backing must have
     * - a proof of the same tree as the statement
     * - a nullifier that is the statementId
     * - no previous backing with the same nullifierHash
     * - a valid proof
     * - a signal that is the statementId
     *
     * also check the tree is stored (this should always be the case)
     */

    /** a proof of the same tree as the statement */
    const statement = await getStatement(backing.statementId);
    const proofTreeId = getTreeId(
      statement.projectId,
      statement.proof.merkleTreeRoot
    );

    const tree = await getTree(proofTreeId);
    if (!tree) {
      throw new Error(`Three with id ${proofTreeId} not found`);
    }

    const isValid = await isValidReaction(
      { proof: backing.proof, treeId: tree.id },
      backing.statementId,
      proofTreeId
    );
    if (!isValid) {
      throw new Error('Invalid backing');
    }

    await setStatementBacker(backing);
    response.status(200).send({ success: true });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
