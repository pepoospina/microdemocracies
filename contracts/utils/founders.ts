import { Entity, PAP } from '@app/types';
import { SignerWithAddress } from 'hardhat-deploy-ethers/signers';

export const getFounders = (signers: SignerWithAddress[]): PAP[] => [
  { account: signers[0].address, person: { personal: { firstName: 'Founder', lastName: 'one' } } },
  { account: signers[1].address, person: { personal: { firstName: 'Founder', lastName: 'Two' } } },
  { account: signers[2].address, person: { personal: { firstName: 'Founder', lastName: 'Three' } } },
  { account: signers[3].address, person: { personal: { firstName: 'Founder', lastName: 'Four' } } },
];
