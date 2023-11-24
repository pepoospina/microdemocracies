import { RequestHandler } from 'express';
import { logger } from 'firebase-functions/v1';

import { Entity } from '../../../@app/types';
import { deriveEntity } from '../../../@app/utils/cid-hash';
import { setEntity } from '../../../db/setters';

import { addEntityValidationScheme } from './entity.schemas';

export const addApplicationController: RequestHandler = async (
  request,
  response
) => {
  const payload = (await addEntityValidationScheme.validate(
    request.body
  )) as Entity<any>;

  /** validate cid */
  const check = await deriveEntity(payload.object);

  if (check.cid !== payload.cid) {
    throw new Error('Unexpected cid');
  }

  try {
    const id = await setEntity(payload);
    response.status(200).send({ success: true, id });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
