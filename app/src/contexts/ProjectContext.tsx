import { createContext, useContext, useEffect, useState } from 'react';
import { useContractRead, usePublicClient, useQuery } from 'wagmi';
import { useParams } from 'react-router-dom';

import { registryABI } from '../utils/contracts.json';
import { AppApplication, AppProject, AppVouch, HexStr } from '../types';
import { getContract } from 'viem';
import { getApplications, getInviteId, getProject } from '../firestore/getters';
import { useAccountContext } from '../wallet/AccountContext';
import { postInvite } from '../utils/project';

export type ProjectContextType = {
  project?: AppProject;
  projectId?: number;
  address?: HexStr;
  nMembers?: number;
  refetch: () => void;
  isLoading: boolean;
  allVouches?: AppVouch[];
  inviteId?: string;
  resetLink: () => void;
  applications?: AppApplication[];
  refetchApplications: () => void;
};

interface IProjectContext {
  children: React.ReactNode;
}

const ProjectContextValue = createContext<ProjectContextType | undefined>(undefined);

export const ProjectContext = (props: IProjectContext) => {
  const publicClient = usePublicClient();
  const { aaAddress } = useAccountContext();

  const { projectId: routeProjectId } = useParams();

  const [projectId, _setProjectId] = useState<number>();

  /** from route param to projectId */
  useEffect(() => {
    if (routeProjectId) {
      _setProjectId(Number(routeProjectId));
    }
  }, [routeProjectId]);

  /** from projectId to project */
  const { data: project, refetch: refetchProject } = useQuery(['project', projectId], () => {
    if (projectId) {
      return getProject(projectId);
    }
  });

  // all vouches
  const { data: vouchEvents } = useQuery(['allVoucheEvents', project], async () => {
    if (project) {
      const contract = getContract({
        address: project.address,
        abi: registryABI,
        publicClient,
      });

      /** all vouch events */
      const logs = await contract.getEvents.VouchEvent({}, { fromBlock: 'earliest', toBlock: 'latest' });

      return logs;
    }
  });

  const [allVouches, setAllVouches] = useState<AppVouch[]>();

  useEffect(() => {
    if (!publicClient || !vouchEvents) return;

    Promise.all(
      vouchEvents.map(async (e: any) => {
        const block = await publicClient.getBlock(e.blockNumber);
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
    refetch: refetchTotalSupply,
    data: nMembers,
    isLoading,
  } = useContractRead({
    address: project?.address,
    abi: registryABI,
    functionName: 'totalSupply',
    enabled: project !== undefined,
  });

  const refetch = () => {
    refetchTotalSupply();
    refetchProject();
  };

  /** Member unique invite link */
  const { data: inviteId, refetch: refetchInvite } = useQuery(['getInviteLink', aaAddress, projectId], () => {
    if (projectId && aaAddress) {
      return getInviteId(projectId, aaAddress);
    }
  });

  const resetLink = () => {
    if (projectId && aaAddress) {
      postInvite({
        projectId,
        memberAddress: aaAddress,
        creationDate: 0, //ignored
      }).then((id) => refetchInvite());
    }
  };

  /** get applications created for this member */
  const { data: applications, refetch: refetchApplications } = useQuery(['getApplications', aaAddress], () => {
    if (aaAddress) {
      return getApplications(aaAddress);
    }
  });

  return (
    <ProjectContextValue.Provider
      value={{
        projectId: project?.projectId,
        project,
        address: project?.address,
        nMembers: nMembers !== undefined ? Number(nMembers) : undefined,
        refetch,
        isLoading,
        allVouches,
        inviteId,
        resetLink,
        applications,
        refetchApplications,
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
