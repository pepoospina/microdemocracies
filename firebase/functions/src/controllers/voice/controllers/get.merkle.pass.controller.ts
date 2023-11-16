import { RequestHandler } from 'express';
import { logger } from 'firebase-functions/v1';

import { AppGetMerklePass } from '../../../@app/types';
import { getGroup, storeTree } from '../../../utils/groups';

import { getIdentitiesValidationScheme } from './voice.schemas';

export const getMerklePassController: RequestHandler = async (
  request,
  response
) => {
  const payload = (await getIdentitiesValidationScheme.validate(
    request.body
  )) as AppGetMerklePass;

  const group = await getGroup(payload.projectId);
  const treeId = await storeTree(payload.projectId, group);

  const leafIndex = group.indexOf(BigInt(payload.publicId));
  const merklePass = group.generateMerkleProof(leafIndex);
  const merklePassStr = JSON.stringify(merklePass, (key, value) => {
    return typeof value === 'bigint' ? value.toString() : value;
  });

  try {
    response.status(200).send({ merklePassStr, treeId });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
