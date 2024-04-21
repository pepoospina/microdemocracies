import { object, string, number } from 'yup';
import { MAX_STATEMETN_LENGTH as MAX_STATEMENT_LENGTH } from '../../../config/constants';

export const statementValidationScheme = object({
  projectId: number().required(),
  statement: string().max(MAX_STATEMENT_LENGTH).required(),
  statementProof: object({
    treeId: string().required(),
    proof: object().shape({}).required(),  
  }).required(),
  reactionProof: object({
    treeId: string().required(),
    proof: object().shape({}).required(),  
  }).required()
}).noUnknown(true);

export const backStatementValidationScheme = object({
  statementId: string().required(),
  proof: object().shape({}).required(),
}).noUnknown(true);

export const identityValidationScheme = object({
  publicId: string().required(),
  owner: string().required(),
  aaAddress: string().required(),
  signature: string().required(),
}).noUnknown(true);

export const getIdentitiesValidationScheme = object({
  treeId: string().optional(),
  projectId: number().optional(),
  publicId: string().required(),
}).noUnknown(true);
