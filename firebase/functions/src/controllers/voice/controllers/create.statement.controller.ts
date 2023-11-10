import { RequestHandler } from 'express';
import { logger } from 'firebase-functions/v1';

import { verifySignedObject } from '../../../utils/signatures';
import { setStatement } from '../../../db/setters';

import { statementValidationScheme } from './voice.schemas';
import { AppStatement, SignedObject } from 'src/@app/types';

export const createStatementController: RequestHandler = async (
  request,
  response
) => {
  // console.log('validate', request.body);
  const statement = (await statementValidationScheme.validate(
    request.body
  )) as SignedObject<AppStatement>;

  // verify signature is from the author address in the registry
  const id = await verifySignedObject(statement, statement.object.author);

  try {
    await setStatement(statement, id);
    response.status(200).send({ success: true, id });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
