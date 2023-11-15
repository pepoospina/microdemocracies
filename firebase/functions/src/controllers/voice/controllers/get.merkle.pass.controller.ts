import { RequestHandler } from 'express';
import { logger } from 'firebase-functions/v1';

import { AppGetMerklePass } from '../../../@app/types';
import { getGroup } from '../../../utils/groups';

import { getIdentitiesValidationScheme } from './voice.schemas';

export const getMerklePassController: RequestHandler = async (
  request,
  response
) => {
  const payload = (await getIdentitiesValidationScheme.validate(
    request.body
  )) as AppGetMerklePass;

  const group = await getGroup(payload.projectId);
  const leafIndex = group.indexOf(BigInt(payload.publicId));
  const merkleProof = group.generateMerkleProof(leafIndex);
  const merkleProofStr = JSON.stringify(merkleProof, (key, value) => {
    return typeof value === 'bigint' ? value.toString() : value;
  });

  try {
    response.status(200).send({ merkleProofStr });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
