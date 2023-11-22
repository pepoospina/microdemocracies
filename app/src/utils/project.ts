import { FUNCTIONS_BASE } from '../config/appConfig';
import { AppInvite, AppProjectCreate, AppProjectMember } from '../types';

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
