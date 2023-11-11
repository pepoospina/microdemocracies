import { AppProjectCreate, AppStatement, SignedObject } from '../@app/types';
import { collections } from './db';

export const getStatement = async (
  statementId: string
): Promise<SignedObject<AppStatement>> => {
  const ref = collections.statements.doc(statementId);
  const doc = await ref.get();
  if (!doc.exists) throw new Error(`Statement ${statementId} not found`);
  const statement = doc.data();
  if (!statement) throw new Error(`Statement not found`);

  return doc.data() as unknown as SignedObject<AppStatement>;
};

export const getProject = async (
  projectId: number
): Promise<AppProjectCreate> => {
  const ref = collections.projects.doc(projectId.toString());
  const doc = await ref.get();
  if (!doc.exists) throw new Error(`Project ${projectId} not found`);
  const statement = doc.data();
  if (!statement) throw new Error(`Statement not found`);

  return doc.data() as unknown as AppProjectCreate;
};
