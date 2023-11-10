import { createContext, useContext, useEffect, useState } from 'react';
import { useContractRead, usePublicClient, useQuery } from 'wagmi';
import { constants } from 'ethers';

import { RegistryAbi, VouchEventAbi } from '../utils/contracts.json';
import { AppVouch, HexStr } from '../types';

export type ProjectContextType = {
  registryAddress?: HexStr;
  setProjectId: (projectId: string) => void;
  projectId?: string;
  projectName?: string;
  nMembers?: number;
  refetch: (options?: { throwOnError: boolean; cancelRefetch: boolean }) => Promise<any>;
  isLoading: boolean;
  allVouches?: AppVouch[];
};

interface IProjectContext {
  children: React.ReactNode;
}

const ProjectContextValue = createContext<ProjectContextType | undefined>(undefined);

export const ProjectContext = (props: IProjectContext) => {
  const registryAddress = constants.AddressZero;

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
    <ProjectContextValue.Provider
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
      {props.children}
    </ProjectContextValue.Provider>
  );
};

export const useProjectContext = (): ProjectContextType => {
  const context = useContext(ProjectContextValue);
  if (!context) throw Error('context not found');
  return context;
};
