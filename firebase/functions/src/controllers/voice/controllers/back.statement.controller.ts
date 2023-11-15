import { RequestHandler } from 'express';
import { logger } from 'firebase-functions/v1';

import { getProject } from '../../../db/getters';
import { setStatementBacker } from '../../../db/setters';

import { backStatementValidationScheme } from './voice.schemas';
import { verifySignedStatement } from '../../../utils/signatures';
import { AppStatementBacking, SignedObject } from 'src/@app/types';

export const backStatementController: RequestHandler = async (
  request,
  response
) => {
  // console.log('validate', request.body);
  const backing = (await backStatementValidationScheme.validate(
    request.body
  )) as SignedObject<AppStatementBacking>;

  // verify signature is from the author address in the registry
  const project = await getProject(backing.object.projectId);

  const id = await verifySignedStatement(
    backing,
    backing.object.backer,
    project.address
  );

  try {
    await setStatementBacker(backing, id);
    response.status(200).send({ success: true, id });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
