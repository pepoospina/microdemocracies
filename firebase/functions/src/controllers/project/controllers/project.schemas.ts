import { object, string, number } from 'yup';
import { MAX_STATEMETN_LENGTH as MAX_STATEMENT_LENGTH } from '../../../config/constants';

export const projectValidationScheme = object({
  projectId: number().required(),
  address: string().required(),
  // whatStatement: string().max(MAX_STATEMENT_LENGTH).required(),
  whoStatement: string().max(MAX_STATEMENT_LENGTH).required(),
  selectedDetails: object().required(),
}).noUnknown(true);

export const addMemberValidationScheme = object({
  projectId: number().required(),
  aaAddress: string().required(),
}).noUnknown(true);

export const addInvitationValidationScheme = object({
  projectId: number().required(),
  memberAddress: string().required(),
}).noUnknown(true);

export const addApplicationValidationScheme = object({
  papEntity: object().shape({}).required(),
  projectId: number().required(),
  invitationId: string().required(),
}).noUnknown(true);
