import { RequestHandler } from 'express';
import { verifyProof } from '@semaphore-protocol/proof';
import { logger } from 'firebase-functions/v1';

import { deserializeProof } from '../../../@app/utils/identity.utils';
import { AppStatementCreate } from '../../../@app/types';
import { TREE_DEPTH } from '../../../utils/groups';

import { statementValidationScheme } from './voice.schemas';

export const createStatementController: RequestHandler = async (
  request,
  response
) => {
  // console.log('validate', request.body);
  const statement = (await statementValidationScheme.validate(
    request.body
  )) as AppStatementCreate;

  // store identity if proof valid
  const proof = deserializeProof(statement.proof);
  const result = await verifyProof(proof, TREE_DEPTH);

  if (!result) {
    throw new Error('Invalid proof');
  }

  try {
    // await setStatement(statement);
    response.status(200).send({ success: true });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
