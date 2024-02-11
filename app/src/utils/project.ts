import { FUNCTIONS_BASE } from '../config/appConfig';
import { AppApply, AppInvite, AppProjectCreate, AppProjectMember, HexStr, PAP } from '../types';

export const postProject = async (create: AppProjectCreate) => {
  const res = await fetch(FUNCTIONS_BASE + '/project/create', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(create),
  });

  const body = await res.json();
  return body.success;
};

export const postMember = async (create: AppProjectMember) => {
  const res = await fetch(FUNCTIONS_BASE + '/project/member', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(create),
  });

  const body = await res.json();
  return body.success;
};

export const postInvite = async (invite: AppInvite) => {
  const res = await fetch(FUNCTIONS_BASE + '/project/newInvite', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invite),
  });

  const body = await res.json();
  return body.id;
};

export const postApply = async (application: AppApply) => {
  const res = await fetch(FUNCTIONS_BASE + '/project/apply', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(application),
  });

  const body = await res.json();
  return body.id;
};

export const postDeleteApplication = async (address: HexStr) => {
  const res = await fetch(FUNCTIONS_BASE + '/project/deleteApplication', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address }),
  });

  const body = await res.json();
  return body.id;
};

export const postAccountInvalidated = async (tokenId: number) => {
  const res = await fetch(FUNCTIONS_BASE + '/project/member/invalidate', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tokenId }),
  });

  const body = await res.json();
  return body.id;
};

export const getProjectMembers = async (projectId: number): Promise<AppProjectMember[]> => {
  const res = await fetch(FUNCTIONS_BASE + '/project/getMembers', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId }),
  });

  const body = await res.json();
  return body.members;
};
