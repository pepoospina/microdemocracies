import { RequestHandler } from 'express';
import { logger } from 'firebase-functions/v1';

import { AppProjectMemberToken } from '../../../@app/types';
import { deleteProjectMember } from '../../../db/setters';
import { getRegistry } from '../../../utils/contracts';
import { getProject } from '../../../db/getters';

import { invalidateMemberValidationScheme } from './project.schemas';
import { zeroAddress } from 'viem';

export const invalidateMemberController: RequestHandler = async (
  request,
  response
) => {
  const payload = (await invalidateMemberValidationScheme.validate(
    request.body
  )) as AppProjectMemberToken;

  /** check the project exist onChain */
  const project = await getProject(payload.projectId);
  const contract = getRegistry(project.address);
  const owner = await contract.read.ownerOf([BigInt(payload.tokenId)]);

  if (owner !== zeroAddress)
    throw new Error(
      `Cant invalidate. Token ${payload.tokenId} is still owned by address ${owner} not a member`
    );

  try {
    deleteProjectMember({ projectId: payload.projectId, aaAddress: owner });
    response.status(200).send({ success: true });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
