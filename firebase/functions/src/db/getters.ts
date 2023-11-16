import {
  AppProjectCreate,
  AppProjectIndex,
  AppPublicIdentity,
  AppStatement,
  AppTree,
  SignedObject,
} from '../@app/types';

import { getTreeId } from '../utils/groups';
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

export const getProjectIndex = async (
  projectId: string
): Promise<AppProjectIndex | undefined> => {
  const ref = collections.projectIndexes.doc(projectId);
  const doc = await ref.get();
  if (!doc.exists) return undefined;
  return doc.data() as unknown as AppProjectIndex;
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

export const getProjectIdentities = async (
  projectId: number
): Promise<AppPublicIdentity[]> => {
  const members = collections.projectMembers(projectId.toString());
  const refs = await members.listDocuments();

  const allDocs = await Promise.all(
    refs.map(async (ref) => {
      const doc = await ref.get();
      const member = doc.exists ? doc.data() : undefined;
      if (member) {
        const identityRef = collections.identities.doc(member.aaAddress);
        const identity = await identityRef.get();
        if (!identity.exists) {
          throw new Error(`Identity not found for user ${member.aaAddress}`);
        }
        return identity.data();
      }
      return undefined;
    })
  );

  return allDocs.filter((doc) => doc !== undefined) as AppPublicIdentity[];
};

export const getTree = async (tree: AppTree) => {
  const ref = collections.trees.doc(getTreeId(tree));
  const doc = await ref.get();

  if (!doc.exists) return undefined;

  return {
    ...doc.data(),
    id: ref.id,
  } as unknown as AppTree & { id: string };
};
