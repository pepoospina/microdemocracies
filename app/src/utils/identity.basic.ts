export const getIdentityId = (publicId: string) => {
  return publicId.slice(0, 16);
};

export const getControlMessage = (publicId: string) => {
  return `Controlling publicId: ${getIdentityId(publicId)}`;
};
