import {
  AppInvite,
  AppProjectCreate,
  AppPublicIdentity,
  AppStatement,
  AppTree,
} from '../@app/types';

import { sortIdentities } from '../utils/groups';
import { collections } from './db';

export const getStatement = async (statementId: string) => {
  const ref = collections.statements.doc(statementId);
  const doc = await ref.get();
  if (!doc.exists) throw new Error(`Statement ${statementId} not found`);
  const statement = doc.data();
  if (!statement) throw new Error(`Statement not found`);

  return doc.data() as unknown as AppStatement;
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

export const getTreeFull = async (treeId: string): Promise<AppTree> => {
  const tree = await getTree(treeId);

  if (!tree) throw new Error('tree not found');

  const refs = await collections.treeIdentities(treeId).listDocuments();
  const _publicIds = await Promise.all(
    refs.map(async (ref) => {
      const doc = await ref.get();
      return doc.data() as { publicId: string };
    })
  );

  const publicIds = sortIdentities(_publicIds);

  return {
    projectId: tree.projectId,
    root: tree.root,
    publicIds: publicIds.map((p) => p.publicId),
  };
};

export const getTree = async (treeId: string) => {
  const ref = collections.trees.doc(treeId);
  const doc = await ref.get();

  if (!doc.exists) return undefined;

  return {
    ...doc.data(),
    id: ref.id,
  } as unknown as AppTree & { id: string };
};

export const hasBackingWithNullifierHash = async (
  statementId: string,
  nullifierHash: string
) => {
  const q = collections
    .statementsBackers(statementId)
    .where('proof.nullifierHash', '==', nullifierHash);
  const snap = await q.get();

  return !snap.empty;
};

export const getInvite = async (projectId: number, invitationId: string) => {
  const ref = collections
    .projectInvitations(projectId.toString())
    .doc(invitationId);
  const doc = await ref.get();

  if (!doc.exists) return undefined;

  return {
    ...doc.data(),
    id: ref.id,
  } as unknown as AppInvite & { id: string };
};
