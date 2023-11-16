import { SemaphoreProofStrings } from '../types';

export const getIdentityId = (publicId: string) => {
  return publicId.slice(0, 16);
};

export const getControlMessage = (publicId: string) => {
  return `Controlling publicId: ${getIdentityId(publicId)}`;
};

export const serializeProof = (proof: any): SemaphoreProofStrings => {
  // to string all NumericString;
  const str = JSON.stringify(proof, (key, value) => {
    return value.toString();
  });
  return JSON.parse(str);
};

export const deserializeProof = (proof: SemaphoreProofStrings): any => {
  // to string all NumericString;
  return JSON.parse(
    JSON.stringify(proof, (key, value) => {
      return value.toString();
    })
  );
};
