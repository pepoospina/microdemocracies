import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('RegistryFactory', (m) => {
  const master = m.contract('Registry', []);
  const factory = m.contract('RegistryFactory', [master]);
  return { factory };
});
