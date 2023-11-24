import { Web3Storage } from 'web3.storage';
import { FUNCTIONS_BASE, WEB3_STORAGE_KEY } from '../config/appConfig';
import { Entity } from '../types';
import { deriveEntity, cidConfigOf, bufferToHash, hash2cid, bytesToObject } from './cid-hash';

export const putObject = async <T extends object>(object: T): Promise<Entity<T>> => {
  const entity = await deriveEntity<T>(object);
  return putEntity(entity);
};

export const putEntity = async (entity: Entity): Promise<Entity> => {
  const res = await fetch(FUNCTIONS_BASE + '/entities/entity', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entity),
  });

  const body = await res.json();
  const cid = await body.success;

  if (entity.cid !== cid.id) {
    throw new Error(`Unexpected CID ${cid}. Expected ${entity.cid}`);
  }

  return entity;
};

export const getEntity = async <T>(cid: string): Promise<Entity<T>> => {
  const entity = await getEntity<T>(cid);
  if (entity.cid !== cid) throw new Error(`Unexpected getInviteLinkCID ${entity.cid}. Expected ${cid}`);

  return entity;
};
