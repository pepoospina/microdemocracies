import { RequestHandler } from 'express';
import { logger } from 'firebase-functions/v1';

import { verifySignedStatement } from '../../../utils/signatures';
import { setStatement } from '../../../db/setters';
import { getProject } from '../../../db/getters';

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

  // verify signature is from the author address in the registry
  const project = await getProject(statement.object.projectId);

  const id = await verifySignedStatement(
    statement,
    statement.object.author,
    project.address
  );

  try {
    await setStatement(statement, id);
    response.status(200).send({ success: true, id });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
