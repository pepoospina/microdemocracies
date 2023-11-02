import { putObject } from '@app/utils/store';
import { Entity, PAP } from '@app/types';

export const prepareFounders = async () => {
  const entities: Entity<PAP>[] = [];

  const signers = await hre.ethers.getSigners();

  const founders = [
    { account: signers[0].address, person: { personal: { firstName: 'Founder', lastName: 'one' } } },
    { account: signers[1].address, person: { personal: { firstName: 'Founder', lastName: 'Two' } } },
    { account: signers[2].address, person: { personal: { firstName: 'Founder', lastName: 'Three' } } },
    { account: signers[3].address, person: { personal: { firstName: 'Founder', lastName: 'Four' } } },
  ];

  for (const founder of founders) {
    const papEntity = await putObject(founder);
    entities.push(papEntity);
  }

  const addresses = entities.map((f) => f.object.account);
  const personsCids = entities.map((f) => f.cid);

  return { addresses, personsCids };
};
