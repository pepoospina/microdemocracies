import { FUNCTIONS_BASE } from '../config/appConfig';
import { AppProjectCreate, HexStr } from '../types';

export const postProject = async (create: AppProjectCreate) => {
  const res = await fetch(FUNCTIONS_BASE + '/project/create', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(create),
  });

  const body = await res.json();
  return body.success;
};
