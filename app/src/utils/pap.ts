import { PAP } from '../types';

export const getPapShortname = (pap: PAP) => {
  if (pap.person && pap.person.personal) {
    return `${pap.person.personal.firstName ? pap.person.personal.firstName : ''}${
      pap.person.personal.lastName ? ` ${pap.person.personal.lastName}` : ''
    }`;
  }

  if (pap.person.platforms) {
    if (pap.person.platforms[0]) {
    }
  }
};
