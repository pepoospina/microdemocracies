import stringify from 'canonical-json';
import { FUNCTIONS_BASE } from '../config/appConfig';

import { HexStr, AppStatementCreate, AppPublicIdentity, AppGetMerklePass } from '../types';

export type MessageSigner = (input: { message: string }) => Promise<HexStr>;

export const signStatement = async (statement: AppStatementCreate, signMessage: MessageSigner) => {
  const message = stringify(statement);
  console.log({ message });
  const signature = await signMessage({
    message,
  });
  return { object: statement, signature };
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

export const getMerklePass = async (details: AppGetMerklePass) => {
  const res = await fetch(FUNCTIONS_BASE + '/voice/merklepass/get', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details),
  });

  const body = await res.json();
  return body.success;
};
