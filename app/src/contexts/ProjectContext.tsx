import { createContext, useContext, useEffect, useState } from 'react';
import { useContractRead, useQuery } from 'wagmi';
import { useParams } from 'react-router-dom';

import { registryABI } from '../utils/contracts.json';
import { AppApplication, AppProject, AppProjectMember, HexStr, StatementRead } from '../types';
import { getApplications, getInviteId, getProject, getTopStatements } from '../firestore/getters';
import { useAccountContext } from '../wallet/AccountContext';
import { getProjectMembers, postInvite } from '../utils/project';
import { collections } from '../firestore/database';
import { onSnapshot } from 'firebase/firestore';

export type ProjectContextType = {
  project?: AppProject | null;
  projectId?: number;
  address?: HexStr;
  nMembers?: number;
  refetch: () => void;
  isLoading: boolean;
  members?: AppProjectMember[];
  inviteId?: string;
  resetLink: () => void;
  resettingLink: boolean;
  applications?: AppApplication[] | null;
  refetchApplications: () => void;
  statements?: StatementRead[];
  refetchStatements: () => void;
};

interface IProjectContext {
  children: React.ReactNode;
}

const ProjectContextValue = createContext<ProjectContextType | undefined>(undefined);

export const ProjectContext = (props: IProjectContext) => {
  const { aaAddress } = useAccountContext();

  const { projectId: routeProjectId } = useParams();

  const [projectId, _setProjectId] = useState<number>();
  const [resettingLink, setResettingLink] = useState<boolean>(false);

  /** from route param to projectId */
  useEffect(() => {
    if (routeProjectId) {
      _setProjectId(Number(routeProjectId));
    }
  }, [routeProjectId]);

  /** from projectId to project */
  const { data: _project, refetch: refetchProject } = useQuery(['project', projectId], () => {
    if (projectId) {
      return getProject(projectId);
    }
    return null;
  });

  /** query cannot return undefined, consider project undefined if projectId is undefined */
  const project = _project && projectId ? _project : undefined;

  // all vouches
  const { data: members, refetch: refetchMembers } = useQuery(['allMembers', project], async () => {
    if (project) {
      return getProjectMembers(project.projectId);
    }
    return null;
  });

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
    refetchMembers();
  };

  /** Member unique invite link */
  const { data: inviteId, refetch: refetchInvite } = useQuery(['getInviteLink', aaAddress, projectId], () => {
    if (projectId && aaAddress) {
      return getInviteId(projectId, aaAddress);
    }
    return null;
  });

  const { data: statements, refetch: refetchStatements } = useQuery(
    ['topStatements', projectId?.toString()],
    async () => {
      if (projectId) {
        return getTopStatements(projectId);
      }
      return null;
    }
  );

  const resetLink = () => {
    if (projectId && aaAddress) {
      setResettingLink(true);
      postInvite({
        projectId,
        memberAddress: aaAddress,
        creationDate: 0, //ignored
      }).then((id) => {
        refetchInvite();
        setResettingLink(false);
      });
    }
  };

  /** get applications created for this member */
  const { data: applications, refetch: refetchApplications } = useQuery(['getApplications', aaAddress], () => {
    if (aaAddress) {
      return getApplications(aaAddress);
    }
    return null;
  });

  /** autorefetch on applications changes */
  useEffect(() => {
    if (aaAddress) {
      const unsub = onSnapshot(collections.userApplications(aaAddress), (doc) => {
        refetchApplications();
      });
      return unsub;
    }
  }, [aaAddress, refetchApplications]);

  return (
    <ProjectContextValue.Provider
      value={{
        projectId: project?.projectId,
        project,
        address: project?.address,
        nMembers: nMembers !== undefined ? Number(nMembers) : undefined,
        refetch,
        isLoading,
        members: members ? members : [],
        inviteId,
        resetLink,
        resettingLink,
        applications,
        refetchApplications,
        statements: statements ? statements : undefined,
        refetchStatements,
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
