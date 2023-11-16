import { object, string, number } from 'yup';
import { MAX_STATEMETN_LENGTH as MAX_STATEMENT_LENGTH } from '../../../config/constants';

export const projectValidationScheme = object({
  projectId: number().required(),
  address: string().required(),
  // whatStatement: string().max(MAX_STATEMENT_LENGTH).required(),
  whoStatement: string().max(MAX_STATEMENT_LENGTH).required(),
  selectedDetails: object().required(),
}).noUnknown(true);
