import { RequestHandler } from 'express';
import { logger } from 'firebase-functions/v1';

import { BigNumber } from '@ethersproject/bignumber';

import { AppBackingCreate } from '../../../@app/types';
import { getTreeId } from '../../../@app/utils/identity.utils';
import { getStatement, getTree } from '../../../db/getters';
import { setStatementBacker } from '../../../db/setters';
import { TREE_DEPTH } from '../../../utils/groups';

import { backStatementValidationScheme } from './voice.schemas';
import { verifyProof } from '@semaphore-protocol/proof';

export const backStatementController: RequestHandler = async (
  request,
  response
) => {
  const backing = (await backStatementValidationScheme.validate(
    request.body
  )) as AppBackingCreate;

  /** the backing must have
   * - a proof of the same tree as the statement
   * - a nullifier that is the statementId
   * - a signal that is the statementId
   *
   * also check the tree is stored (this should always be the case)
   */

  const statement = await getStatement(backing.statementId);
  const proofTreeId = getTreeId(
    statement.projectId,
    statement.proof.merkleTreeRoot
  );

  if (statement.treeId !== proofTreeId) {
    throw new Error(
      `Tree id of the backing signal ${proofTreeId} is not the same as the treeId of that of the statement ${statement.treeId}`
    );
  }

  const tree = await getTree(proofTreeId);

  if (!tree) {
    throw new Error(`Three with id ${proofTreeId} not found`);
  }

  const expectedNullifier = BigNumber.from(backing.statementId).toString();
  if (backing.proof.externalNullifier !== expectedNullifier) {
    throw new Error(
      `Backing signal nullifier ${backing.proof.nullifierHash} must be the statement id ${backing.statementId}`
    );
  }

  const result = await verifyProof(backing.proof, TREE_DEPTH);

  if (!result) {
    throw new Error('Invalid proof');
  }

  try {
    await setStatementBacker(backing);
    response.status(200).send({ success: true });
  } catch (error: any) {
    logger.error('error', error);
    response.status(500).send({ success: false, error: error.message });
  }
};
