import { providers } from 'ethers';

import contractsJson from '../generated/contracts.json';
import { Registry__factory } from '../generated/typechain';

function addressOnChain(chainId: number): `0x{string}` {
  const json = (contractsJson as any)[chainId.toString()];
  if (json === undefined) throw new Error(`JSON of chain ${chainId} not found`);

  const chainName = Object.getOwnPropertyNames(json);
  if (chainName.length === 0)
    throw new Error(`JSON of chain ${chainId} not found`);

  return json[chainName[0]]['contracts']['Registry'].address;
}
const registryAddress = addressOnChain(137);

const provider = new providers.AlchemyProvider(
  'matic',
  '9_KaUJ0DnMqDMpe9Jt1d_eXx554ooAtG'
);

const registry = Registry__factory.connect(registryAddress, provider);

export { registryAddress, registry };
