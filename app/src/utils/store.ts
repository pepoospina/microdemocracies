import { Web3Storage } from 'web3.storage';
import { appConfig } from '../config';
import { Entity } from '../types';
import { deriveEntity, cidConfigOf, bufferToHash, hash2cid, objectToBytes, bytesToObject } from './cid-hash';

export const putObject = async (object: any): Promise<Entity> => {
  const entity = await deriveEntity(object);
  return putEntity(entity);
};

export const putEntity = async (entity: Entity): Promise<Entity> => {
  const client = new Web3Storage({ token: appConfig.WEB3_STORAGE_KEY });

  const buffer = objectToBytes(entity.object);

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(buffer);
      controller.close();
    },
  });

  const cid = await client.put([{ name: '', stream: () => stream }], { wrapWithDirectory: false });

  if (cid !== entity.cid) {
    throw new Error(`Unexpected CID ${cid}. Expected ${entity.cid}`);
  }

  return entity;
};

export const getEntity = async (cid: string): Promise<Entity> => {
  const client = new Web3Storage({ token: appConfig.WEB3_STORAGE_KEY });

  const response = await client.get(cid);
  const cidConfig = cidConfigOf(cid);

  if (!response || !response.body) throw new Error('Undefined body');
  const [file] = await response?.files();
  const array = await file.arrayBuffer();

  /** verify */
  const hash = await bufferToHash(new Uint8Array(array), cidConfig.type);
  const _cid = hash2cid(hash, cidConfig);
  const object = bytesToObject(array);

  if (cid !== _cid) throw new Error(`Unexpected CID ${_cid}. Expected ${cid}`);

  return { cid, object };
};
