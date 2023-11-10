import { stringify } from 'viem';
import { FUNCTIONS_BASE } from '../config/appConfig';

import { HexStr, AppStatementCreate } from '../types';

export type MessageSigner = (input: { message: string }) => Promise<HexStr>;

export const signStatement = async (tokenId: number, statement: string, signMessage: MessageSigner) => {
  const object: AppStatementCreate = { author: tokenId, statement };
  const message = stringify(object);
  console.log({ message });
  const signature = await signMessage({
    message,
  });
  return { object, signature };
};

export const postStatement = async (tokenId: number, statement: string, signMessage: MessageSigner) => {
  const signedStatement = await signStatement(tokenId, statement, signMessage);
  const res = await fetch(FUNCTIONS_BASE + '/voice/statement', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signedStatement),
  });

  const body = await res.json();
  return body.success;
};
