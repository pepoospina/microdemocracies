import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useConnect, useContractRead, useDisconnect, usePublicClient, useQuery } from 'wagmi';
import { constants } from 'ethers';

import { RegistryAbi, VouchEventAbi } from '../utils/contracts.json';
import { ConnectedAccountContext } from './ConnectedAccountContext';
import { AppVouch, HexStr } from '../types';

export type RegistryContextType = {
  registryAddress?: HexStr;
  setProjectId: (projectId: string) => void;
  projectId?: string;
  projectName?: string;
  nMembers?: number;
  refetch: (options?: { throwOnError: boolean; cancelRefetch: boolean }) => Promise<any>;
  isLoading: boolean;
  allVouches?: AppVouch[];
};

interface IRegistryContext {
  children: React.ReactNode;
}

const RegistryContextValue = createContext<RegistryContextType | undefined>(undefined);

export const RegistryContext = (props: IRegistryContext) => {
  const registryAddress = constants.AddressZero;

  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected, address: connectedAddress } = useAccount();

  const publicClient = usePublicClient();

  const [projectId, _setProjectId] = useState<string>();

  const setProjectId = (projectId: string) => {
    _setProjectId(projectId);
  };

  // all vouches
  const { data: vouchEvents } = useQuery(['allVoucheEvents'], async () => {
    const logs = await (publicClient as any).getLogs({
      address: registryAddress,
      event: VouchEventAbi,
      fromBlock: 'earliest',
      toBlock: 'latest',
    });

    return logs;
  });

  const [allVouches, setAllVouches] = useState<AppVouch[]>();

  useEffect(() => {
    if (!publicClient || !vouchEvents) return;

    Promise.all(
      vouchEvents.map(async (e: any) => {
        const block = await (publicClient as any).getBlock(e.blockNumber);
        return {
          from: e.args.from.toString(),
          to: e.args.to.toString(),
          personCid: e.args.personCid,
          vouchDate: +block.timestamp.toString(),
        };
      })
    ).then((vouches) => setAllVouches(vouches));
  }, [vouchEvents, publicClient]);

  const {
    refetch,
    data: nMembers,
    isLoading,
  } = useContractRead({
    address: registryAddress,
    abi: RegistryAbi,
    functionName: 'totalSupply',
  });

  return (
    <RegistryContextValue.Provider
      value={{
        registryAddress,
        setProjectId,
        projectId,
        projectName: 'Test',
        nMembers: nMembers !== undefined ? Number(nMembers) : undefined,
        refetch,
        isLoading,
        allVouches,
      }}>
      <ConnectedAccountContext>{props.children}</ConnectedAccountContext>
    </RegistryContextValue.Provider>
  );
};

export const useRegistry = (): RegistryContextType => {
  const context = useContext(RegistryContextValue);
  if (!context) throw Error('context not found');
  return context;
};
