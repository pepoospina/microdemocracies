import { useQuery } from '@tanstack/react-query'

import { useEffect, useState } from 'react'

import { AppAccount, AppVouch, Entity, HexStr, PAP } from '../types'
import { registryABI } from '../utils/contracts.json'
import { getEntity } from '../utils/store'
import { useAccountContext } from '../wallet/AccountContext'
import { useProjectContext } from './ProjectContext'

import { useReadContract } from 'wagmi'

export type AccountContextType = {
  refetch: (options?: { throwOnError: boolean; cancelRefetch: boolean }) => Promise<any>
  account?: AppAccount
  accountPap?: Entity<PAP>
  vouchRead?: AppVouch
  voucherPapRead?: Entity<PAP>
  isLoadingAccount: boolean
  voucherTokenId?: number
  tokenId?: number
  address?: string
}

export interface AccountContextProps {
  tokenId?: number
  address?: HexStr
}

/**
 * from a tokenId or an address, read the data about it from the
 * registry and IPFS. TokenId can be a property or set with setTokenId
 */
export const useMember = (props: AccountContextProps): AccountContextType => {
  const { address: projectAddress } = useProjectContext()
  const { aaAddress } = useAccountContext()

  /** Read Account (either one or the other) */
  if (props.tokenId !== undefined && props.address !== undefined)
    throw new Error("Both tokenId and address can't be provided")

  const _tokenIdProp =
    props.address === undefined ? (props.tokenId !== undefined ? BigInt(props.tokenId) : undefined) : undefined

  const _addressProp = props.tokenId === undefined ? props.address || aaAddress : undefined

  const [tokenId, _setTokenId] = useState<bigint>()
  const [address, setAddress] = useState<HexStr>()

  /** if tokenId prop changes, trigger an account read */
  useEffect(() => {
    if (_tokenIdProp) {
      _setTokenId(_tokenIdProp)
    }
  }, [_tokenIdProp])

  /** if address prop changes, trigger a tokenIdOfAddress read */
  useEffect(() => {
    if (_addressProp) {
      setAddress(_addressProp)
    }
  }, [_addressProp])

  const {
    data: tokenIdOfAddress,
    isLoading: isLoadingTokenId,
    refetch: refetchTokenIdOfAddress,
  } = useReadContract({
    address: projectAddress,
    abi: registryABI,
    functionName: 'tokenIdOf',
    args: address ? [address] : undefined,
    query: { enabled: address !== undefined && projectAddress !== undefined },
  })

  /** if tokenIdOfAddress changes, update the account */
  useEffect(() => {
    if (tokenIdOfAddress) {
      _setTokenId(tokenIdOfAddress)
    }
  }, [tokenIdOfAddress])

  const {
    refetch: refetchAccount,
    data: _accountRead,
    isLoading: isLoadingAccount,
  } = useReadContract({
    address: projectAddress,
    abi: registryABI,
    functionName: 'getAccount',
    args: tokenId ? [tokenId] : tokenIdOfAddress ? [tokenIdOfAddress] : undefined,

    query: {
      enabled: (tokenId !== undefined || tokenIdOfAddress !== undefined) && projectAddress !== undefined,
    },
  })

  const refetch = tokenId ? refetchAccount : refetchTokenIdOfAddress

  const { data: accountVouch } = useReadContract({
    address: projectAddress,
    abi: registryABI,
    functionName: 'getTokenVouch',
    args: tokenId ? [tokenId] : undefined,
    query: { enabled: tokenId !== undefined && projectAddress !== undefined },
  })

  const { data: voucherVouch } = useReadContract({
    address: projectAddress,
    abi: registryABI,
    functionName: 'getTokenVouch',
    args: _accountRead !== undefined ? [_accountRead.voucher] : undefined,

    query: {
      enabled: _accountRead !== undefined && projectAddress !== undefined,
    },
  })

  const { data: accountPapRead } = useQuery({
    queryKey: ['accountPap', accountVouch?.personCid],
    queryFn: () => {
      if (accountVouch?.personCid) {
        return getEntity<PAP>(accountVouch?.personCid)
      }
    },
  })

  const { data: voucherPapRead } = useQuery({
    queryKey: ['voucherPap', voucherVouch?.personCid],
    queryFn: () => {
      if (voucherVouch?.personCid) {
        return getEntity<PAP>(voucherVouch?.personCid)
      }
    },
  })

  const accountRead = _accountRead && {
    account: _accountRead.account,
    valid: _accountRead.valid,
    voucher: Number(_accountRead.voucher),
    tokenId: Number(tokenId),
  }

  return {
    refetch,
    account: accountRead,
    accountPap: accountPapRead,
    isLoadingAccount: isLoadingAccount || isLoadingTokenId,
    tokenId: Number(tokenId),
    address,
    voucherTokenId: _accountRead !== undefined ? Number(_accountRead.voucher) : undefined,
    voucherPapRead,
  }
}
