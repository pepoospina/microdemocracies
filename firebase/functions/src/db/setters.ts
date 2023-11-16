import {
  AppProjectCreate,
  AppPublicIdentity,
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

export const setIdentity = async (
  identity: AppPublicIdentity
): Promise<string> => {
  const id = identity.aaAddress;
  const docRef = collections.identities.doc(id);
  await docRef.set(identity);
  return docRef.id;
};

export const createProject = async (
  project: AppProjectCreate
): Promise<string> => {
  const projectId = project.projectId.toString();
  const ref = collections.projects.doc(projectId);
  const doc = await ref.get();

  if (doc.exists) throw new Error(`Project already exist`);

  const docRef = collections.projects.doc(projectId);
  await docRef.set(project);
  return docRef.id;
};
