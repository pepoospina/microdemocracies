import { object, string, number } from 'yup';
import { MAX_STATEMETN_LENGTH as MAX_STATEMENT_LENGTH } from '../../../config/constants';

export const statementValidationScheme = object({
  projectId: number().required(),
  proof: object().required(),
  treeId: string().required(),
  statement: string().max(MAX_STATEMENT_LENGTH).required(),
}).noUnknown(true);

export const backStatementValidationScheme = object({
  object: object({
    backer: number().required(),
    statement: string().max(MAX_STATEMENT_LENGTH).required(),
    projectId: number().required(),
    statementId: string().required(),
  }),
  signature: string().required(),
}).noUnknown(true);

export const identityValidationScheme = object({
  publicId: string().required(),
  owner: string().required(),
  aaAddress: string().required(),
  signature: string().required(),
}).noUnknown(true);

export const getIdentitiesValidationScheme = object({
  projectId: number().required(),
  publicId: string().required(),
}).noUnknown(true);
