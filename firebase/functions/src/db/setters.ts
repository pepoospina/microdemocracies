import { hashMessage } from 'viem';
import {
  AppProjectCreate,
  AppProjectMember,
  AppPublicIdentity,
  AppStatementBacking,
  AppStatementCreate,
  AppTree,
  SignedObject,
} from '../@app/types';

import { getTreeId } from '../utils/groups';
import { collections } from './db';

export const setStatementBacker = async (
  statement: SignedObject<AppStatementBacking>,
  id: string
): Promise<string> => {
  const docRef = collections.statementsBackers.doc(id);
  await docRef.set(statement);
  return docRef.id;
};

export const getStatementId = (statement: AppStatementCreate) => {
  const hash = hashMessage(JSON.stringify(statement.proof));
  return hash.slice(0, 18);
};

export const setStatement = async (
  statement: AppStatementCreate
): Promise<string> => {
  const id = getStatementId(statement);
  const docRef = collections.statements.doc(id);
  await docRef.set(statement);
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

export const setProjectMember = async (
  member: AppProjectMember
): Promise<string> => {
  const id = member.aaAddress;
  const docRef = collections
    .projectMembers(member.projectId.toString())
    .doc(id);
  await docRef.set(member);
  return docRef.id;
};

export const setTree = async (tree: AppTree): Promise<string> => {
  const docRef = collections.trees.doc(getTreeId(tree));
  await docRef.set(tree);
  return docRef.id;
};
