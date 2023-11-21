import { PropsWithChildren, createContext, useContext } from 'react';

import { AppProject } from '../types';
import { useAccountContext } from './AccountContext';
import { useQuery } from 'react-query';
import { getAccountProjects } from '../firestore/getters';

export type AccountDataContextType = {
  projects?: AppProject[];
};

const AccountDataContextValue = createContext<AccountDataContextType | undefined>(undefined);

/** Manages the AA user ops and their execution */
export const AccountDataContext = (props: PropsWithChildren) => {
  const { aaAddress } = useAccountContext();

  const { data: projects } = useQuery(['accountProject', aaAddress?.toString()], async () => {
    if (aaAddress) {
      return getAccountProjects(aaAddress);
    }
  });

  return (
    <AccountDataContextValue.Provider
      value={{
        projects,
      }}>
      {props.children}
    </AccountDataContextValue.Provider>
  );
};

export const useAccountDataContext = (): AccountDataContextType => {
  const context = useContext(AccountDataContextValue);
  if (!context) throw Error('context not found');
  return context;
};
