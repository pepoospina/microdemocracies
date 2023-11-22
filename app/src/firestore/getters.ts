import { getDocs, where, query, and, getDoc } from 'firebase/firestore';
import { collections } from './database';
import {
  AppInvite,
  AppProject,
  AppProjectMember,
  AppPublicIdentity,
  HexStr,
  StatementBackerRead,
  StatementRead,
} from '../types';
import { postInvite } from '../utils/project';

export const getProject = async (projectId: number) => {
  const ref = collections.project(projectId);
  const doc = await getDoc(ref);

  return {
    ...doc.data(),
    id: doc.id,
  } as unknown as AppProject;
};

export const getAccountProjects = async (aaAddress: HexStr) => {
  const q = query(collections.members, where('aaAddress', '==', aaAddress));
  const snap = await getDocs(q);

  const projectIds = snap.docs.map((doc) => {
    return doc.data().projectId;
  });

  const projects = await Promise.all(
    projectIds.map((pId) => {
      return getProject(pId);
    })
  );

  return projects;
};

export const getTopStatements = async (projectId: number) => {
  const q = query(collections.statements, where('projectId', '==', projectId));
  const snap = await getDocs(q);

  return snap.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id,
    } as unknown as StatementRead;
  });
};

export const getInviteId = async (projectId: number, aaAddress: HexStr) => {
  const q = query(collections.projectInvites(projectId), where('memberAddress', '==', aaAddress));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.docs.length === 0) {
    return await postInvite({ projectId, memberAddress: aaAddress, creationDate: 0 });
  }

  const doc = querySnapshot.docs[0];
  return {
    ...doc.data(),
    id: doc.id,
  } as unknown as AppInvite;
};

export const getStatementBackers = async (statementId: string) => {
  const q = query(collections.statementsBackers, where('object.statementId', '==', statementId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id,
    } as unknown as StatementBackerRead;
  });
};

export const isStatementBacker = async (statementId: string, tokenId: number): Promise<boolean> => {
  const q = query(
    collections.statementsBackers,
    and(where('object.statementId', '==', statementId), where('object.backer', '==', tokenId))
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.length === 1;
};

export const getPublicIdentity = async (aaAddress: HexStr) => {
  const ref = collections.identity(aaAddress);
  const doc = await getDoc(ref);

  if (!doc.exists()) return undefined;

  return {
    ...doc.data(),
  } as unknown as AppPublicIdentity;
};
