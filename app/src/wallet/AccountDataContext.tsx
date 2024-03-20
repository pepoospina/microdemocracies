import { PropsWithChildren, createContext, useContext } from 'react'

import { AppProject } from '../types'
import { useAccountContext } from './AccountContext'
import { getAccountProjects } from '../firestore/getters'
import { useQuery } from '@tanstack/react-query'

export type AccountDataContextType = {
  projects?: AppProject[]
}

const AccountDataContextValue = createContext<AccountDataContextType | undefined>(undefined)

/** Manages the AA user ops and their execution */
export const AccountDataContext = (props: PropsWithChildren) => {
  const { aaAddress } = useAccountContext()

  const { data: projects } = useQuery({
    queryKey: ['accountProject', aaAddress?.toString()],
    queryFn: async () => {
      if (aaAddress) {
        return getAccountProjects(aaAddress)
      }
      return null
    },
  })

  return (
    <AccountDataContextValue.Provider
      value={{
        projects: projects?.filter((p) => p !== null),
      }}
    >
      {props.children}
    </AccountDataContextValue.Provider>
  )
}

export const useAccountDataContext = (): AccountDataContextType => {
  const context = useContext(AccountDataContextValue)
  if (!context) throw Error('context not found')
  return context
}
