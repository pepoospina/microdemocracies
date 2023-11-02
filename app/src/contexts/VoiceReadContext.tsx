import { createContext, useContext } from 'react';

import { ConnectedAccountContext } from './ConnectedAccountContext';
import { StatementRead } from '../types';
import { useQuery } from 'react-query';
import { getTopStatements } from '../firestore/getters';

export type VoiceReadContextType = {
  statements?: StatementRead[];
};

interface IVoiceContext {
  children: React.ReactNode;
}

const VoiceReadContextValue = createContext<VoiceReadContextType | undefined>(undefined);

export const VoiceReadContext = (props: IVoiceContext) => {
  const { data: statements } = useQuery(['topStatements'], async () => {
    return getTopStatements();
  });

  return (
    <VoiceReadContextValue.Provider
      value={{
        statements,
      }}>
      <ConnectedAccountContext>{props.children}</ConnectedAccountContext>
    </VoiceReadContextValue.Provider>
  );
};

export const useVoiceRead = (): VoiceReadContextType => {
  const context = useContext(VoiceReadContextValue);
  if (!context) throw Error('context not found');
  return context;
};
