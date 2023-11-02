import { putObject } from '@app/utils/store';
import { Entity, PAP } from '@app/types';
import { cidToHex32 } from '@app/utils/cid-hash';

export const prepareFounders = async () => {
  const signers = await hre.ethers.getSigners();

  // const founders: PAP[] = [
  //   { account: signers[0].address, person: { firstName: 'Founder', lastName: 'one' } },
  //   { account: signers[1].address, person: { firstName: 'Founder', lastName: 'Two' } },
  //   { account: signers[2].address, person: { firstName: 'Founder', lastName: 'Three' } },
  //   { account: signers[3].address, person: { firstName: 'Founder', lastName: 'Four' } },
  // ];

  const founders: PAP[] = [
    { account: '0xFfEB3c7bE84527a44349aFD421dC5a1834DBAa1D', person: { personal: { firstName: 'Founder', lastName: 'one' }, platforms: [] } },
  ];

  const entities: Entity<PAP>[] = [];

  for (const founder of founders) {
    const papEntity = await putObject(founder);
    entities.push(papEntity);
  }

  const addresses = entities.map((f) => f.object.account);
  const personsCids = entities.map((f) => f.cid);

  return { addresses, personsCids };
};
