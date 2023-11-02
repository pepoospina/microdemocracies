import { StringSchema as OriginalStringSchema } from 'yup';

declare module 'yup' {
  interface StringSchema extends OriginalStringSchema {
    address(message?: string): StringSchema;
  }
}
