import { RequestHandler } from 'express';
import { logger } from 'firebase-functions/v1';

import { statementValidationScheme } from './voice.schemas';
import { AppStatementCreate, SignedObject } from 'src/@app/types';

export const createStatementController: RequestHandler = async (
  request,
  response
) => {
  // console.log('validate', request.body);
  const statement = (await statementValidationScheme.validate(
    request.body
  )) as SignedObject<AppStatementCreate>;

  console.log({ statement });

  // const id = await verifyProof(...)

  try {
    // await setStatement(statement, id: 0);
    response.status(200).send({ success: true });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
