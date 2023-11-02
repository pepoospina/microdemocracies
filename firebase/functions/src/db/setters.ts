import {
  AppStatementBacking,
  AppStatementCreate,
  SignedObject,
} from '../@app/types';
import { collections } from './db';

export const setStatementBacker = async (
  statement: SignedObject<AppStatementBacking>,
  id: string
): Promise<string> => {
  const docRef = collections.statementsBackers.doc(id);
  await docRef.set(statement);
  return docRef.id;
};

export const setStatement = async (
  backing: SignedObject<AppStatementCreate>,
  id: string
): Promise<string> => {
  const docRef = collections.statements.doc(id);
  await docRef.set(backing);
  return docRef.id;
};
