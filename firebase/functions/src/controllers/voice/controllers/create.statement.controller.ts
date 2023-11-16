import { RequestHandler } from 'express';
import { verifyProof } from '@semaphore-protocol/proof';
import { logger } from 'firebase-functions/v1';

import { AppStatementCreate } from '../../../@app/types';

import { TREE_DEPTH } from '../../../utils/groups';
import { setStatement } from '../../../db/setters';

import { statementValidationScheme } from './voice.schemas';

export const createStatementController: RequestHandler = async (
  request,
  response
) => {
  const statement = (await statementValidationScheme.validate(
    request.body
  )) as AppStatementCreate;

  // const statement = request.body as AppStatementCreate;

  // store identity if proof valid
  // const proof = deserializeProof();
  const result = await verifyProof(statement.proof, TREE_DEPTH);

  if (!result) {
    throw new Error('Invalid proof');
  }

  try {
    await setStatement(statement);
    response.status(200).send({ success: true });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
