import stringify from 'canonical-json';
import { FUNCTIONS_BASE } from '../config/appConfig';

import { AppStatementCreate, AppPublicIdentity, AppGetMerklePass, AppReturnMerklePass } from '../types';
import { MessageSigner } from './identity';

export const signObject = async <T>(object: T, signMessage: MessageSigner) => {
  const message = stringify(object);
  console.log({ message });
  const signature = await signMessage(message);
  return { object: object, signature };
};

export const postStatement = async (statement: AppStatementCreate) => {
  const res = await fetch(FUNCTIONS_BASE + '/voice/statement', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(statement),
  });

  const body = await res.json();
  return body.success;
};

export const postIdentity = async (publicIdentity: AppPublicIdentity) => {
  const res = await fetch(FUNCTIONS_BASE + '/voice/identity', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(publicIdentity),
  });

  const body = await res.json();
  return body.success;
};

export const getMerklePass = async (details: AppGetMerklePass): Promise<AppReturnMerklePass> => {
  const res = await fetch(FUNCTIONS_BASE + '/voice/merklepass/get', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details),
  });

  const body = await res.json();
  const merklePass = JSON.parse(body.merklePassStr);
  const parsed = { merklePass, treeId: body.treeId };
  return parsed;
};
