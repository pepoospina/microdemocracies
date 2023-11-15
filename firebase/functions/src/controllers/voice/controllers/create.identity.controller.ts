import { RequestHandler } from 'express';
import { logger } from 'firebase-functions/v1';

import { AppPublicIdentity, SignedObject } from '../../../@app/types';
import { verifySignedObject } from '../../../utils/signatures';
import { setIdentity } from '../../../db/setters';
import { getProject } from '../../../db/getters';
import { getRegistry } from '../../../utils/contracts';

import { identityValidationScheme } from './voice.schemas';

export const createIdentityController: RequestHandler = async (
  request,
  response
) => {
  // console.log('validate', request.body);
  const identity = (await identityValidationScheme.validate(
    request.body
  )) as SignedObject<AppPublicIdentity>;

  // only store identities confirmed by eth addresseses
  await verifySignedObject(identity, identity.object.owner);

  // only store identities that are of addresses currently present in the registy
  const project = await getProject(identity.object.projectId);
  const registry = getRegistry(project.address);
  const balance = await registry.read.balanceOf([identity.object.aaAddress]);

  if (balance === BigInt(0))
    throw new Error(
      `Member ${identity.object.aaAddress} not part of the project`
    );

  try {
    const id = await setIdentity(identity.object);
    response.status(200).send({ success: true, id });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
