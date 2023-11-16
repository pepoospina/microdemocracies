import { AppProjectMember } from '../../../firebase/functions/src/@app/types';
import { FUNCTIONS_BASE } from '../config/appConfig';
import { AppProjectCreate } from '../types';

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
