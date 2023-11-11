import stringify from 'canonical-json';
import { FUNCTIONS_BASE } from '../config/appConfig';

import { HexStr, AppStatementCreate } from '../types';

export type MessageSigner = (input: { message: string }) => Promise<HexStr>;

export const signStatement = async (statement: AppStatementCreate, signMessage: MessageSigner) => {
  const message = stringify(statement);
  console.log({ message });
  const signature = await signMessage({
    message,
  });
  return { object: statement, signature };
};

export const postStatement = async (statement: AppStatementCreate, signMessage: MessageSigner) => {
  const signedStatement = await signStatement(statement, signMessage);
  const res = await fetch(FUNCTIONS_BASE + '/voice/statement', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signedStatement),
  });

  const body = await res.json();
  return body.success;
};
