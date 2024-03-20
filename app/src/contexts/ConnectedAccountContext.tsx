import { ReactNode, createContext, useContext } from 'react'
import { usePublicClient, useReadContract } from 'wagmi'

import { AppAccount, AppChallenge } from '../types'
import { registryABI } from '../utils/contracts.json'
import { useAccountContext } from '../wallet/AccountContext'
import { useMember } from './MemberContext'
import { useProjectContext } from './ProjectContext'

export type ConnectedMemberContextType = {
  tokenId?: number | null
  account?: AppAccount
  myChallenge: AppChallenge | undefined | null
}

const ConnectedMemberContextValue = createContext<ConnectedMemberContextType | undefined>(undefined)

export interface ConnectedMemberContextProps {
  children: ReactNode
}

export const ConnectedMemberContext = (props: ConnectedMemberContextProps) => {
  const { address: projectAddress } = useProjectContext()
  const publicClient = usePublicClient()
  const { aaAddress } = useAccountContext()

  const { data: tokenId, isSuccess } = useReadContract({
    address: projectAddress,
    abi: registryABI,
    functionName: 'tokenIdOf',
    args: aaAddress ? [aaAddress] : undefined,
    query: { enabled: aaAddress !== undefined && projectAddress !== undefined },
  })

  const { account: accountRead } = useMember({
    tokenId: tokenId ? Number(tokenId) : undefined,
  })

  const {
    data: _challengeRead,
    isError: isErrorChallengeRead,
    error: errorChallengeRead,
  } = useReadContract({
    address: projectAddress,
    abi: registryABI,
    functionName: 'getChallenge',
    args: tokenId ? [tokenId] : undefined,
    query: { enabled: tokenId !== undefined && projectAddress !== undefined },
  })

  const myChallenge: AppChallenge | undefined | null = ((_challengeRead) => {
    if (isErrorChallengeRead && errorChallengeRead && errorChallengeRead.message.includes('')) {
      return null
    }
    if (_challengeRead === undefined) {
      return undefined
    }
    if (_challengeRead[0] > 0 && !isErrorChallengeRead) {
      return {
        creationDate: Number(_challengeRead[0]),
        endDate: Number(_challengeRead[1]),
        lastOutcome: Number(_challengeRead[2]),
        nVoted: Number(_challengeRead[3]),
        nFor: Number(_challengeRead[4]),
        executed: _challengeRead[5],
      }
    }
  })(_challengeRead)

  const _tokenId = tokenId ? Number(tokenId) : isSuccess ? null : undefined

  return (
    <ConnectedMemberContextValue.Provider
      value={{
        tokenId: _tokenId,
        account: accountRead,
        myChallenge,
      }}
    >
      {props.children}
    </ConnectedMemberContextValue.Provider>
  )
}

export const useConnectedMember = (): ConnectedMemberContextType => {
  const context = useContext(ConnectedMemberContextValue)
  if (!context) throw Error('context not found')
  return context
}
