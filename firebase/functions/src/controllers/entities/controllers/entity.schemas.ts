import { object, string } from 'yup';

export const addEntityValidationScheme = object({
  object: object().shape({}).required(),
  cid: string().required(),
}).noUnknown(true);
