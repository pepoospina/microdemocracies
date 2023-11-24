import { createContext, useContext } from 'react';

import { StatementRead } from '../types';
import { useQuery } from 'react-query';
import { getTopStatements } from '../firestore/getters';
import { useProjectContext } from './ProjectContext';

export type VoiceReadContextType = {
  statements?: StatementRead[];
  refetchStatements: () => void;
};

interface IVoiceContext {
  children: React.ReactNode;
}

const VoiceReadContextValue = createContext<VoiceReadContextType | undefined>(undefined);

export const VoiceReadContext = (props: IVoiceContext) => {
  const { projectId } = useProjectContext();
  const { data: statements, refetch: refetchStatements } = useQuery(
    ['topStatements', projectId?.toString()],
    async () => {
      if (projectId) {
        return getTopStatements(projectId);
      }
    }
  );

  return (
    <VoiceReadContextValue.Provider
      value={{
        statements,
        refetchStatements,
      }}>
      {props.children}
    </VoiceReadContextValue.Provider>
  );
};

export const useVoiceRead = (): VoiceReadContextType => {
  const context = useContext(VoiceReadContextValue);
  if (!context) throw Error('context not found');
  return context;
};
