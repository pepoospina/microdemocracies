import { getDocs, where, query, and, getDoc, doc as docRef } from 'firebase/firestore';
import { collections } from './database';
import { AppApplication, AppProject, AppPublicIdentity, Entity, HexStr, StatementRead } from '../types';
import { postInvite } from '../utils/project';
import { getAddress } from 'viem';

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
  const invites = collections.projectInvites(projectId);
  const q = query(invites, where('memberAddress', '==', getAddress(aaAddress)));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.docs.length === 0) {
    console.log('user invite not found creating new one', { projectId, aaAddress });
    return await postInvite({ projectId, memberAddress: aaAddress, creationDate: 0 });
  }

  const doc = querySnapshot.docs[0];
  return doc.id;
};

export const getApplications = async (aaAddress: HexStr) => {
  const applications = collections.userApplications(aaAddress);
  const querySnapshot = await getDocs(applications);

  return querySnapshot.docs.map((app) => {
    return {
      ...app.data(),
    } as AppApplication;
  });
};

export const getPublicIdentity = async (aaAddress: HexStr) => {
  const ref = collections.identity(aaAddress);
  const doc = await getDoc(ref);

  if (!doc.exists()) return undefined;

  return {
    ...doc.data(),
  } as unknown as AppPublicIdentity;
};

export const getEntityFirestore = async <T>(cid: string) => {
  const ref = docRef(collections.entities, cid);
  const doc = await getDoc(ref);

  if (!doc.exists()) return undefined;

  return {
    ...doc.data(),
  } as unknown as Entity<T>;
};
