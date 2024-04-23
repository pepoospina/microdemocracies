import { object, string } from 'yup'

export const setAaOwnerValidationScheme = object({
  owner: string().optional(),
  aaAddress: string().optional(),
}).noUnknown(true)
