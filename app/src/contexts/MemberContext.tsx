import { useEffect, useState } from 'react';
import { useContractRead } from 'wagmi';

import { registryABI } from '../utils/contracts.json';
import { AppAccount, AppVouch, Entity, HexStr, PAP } from '../types';
import { useQuery } from 'react-query';
import { getEntity } from '../utils/store';
import { useProjectContext } from './ProjectContext';
import { useAccountContext } from '../wallet/AccountContext';

export type AccountContextType = {
  refetch: (options?: { throwOnError: boolean; cancelRefetch: boolean }) => Promise<any>;
  account?: AppAccount;
  accountPap?: Entity<PAP>;
  vouchRead?: AppVouch;
  voucherPapRead?: Entity<PAP>;
  isLoadingAccount: boolean;
  voucherTokenId?: number;
  tokenId?: number;
  address?: string;
};

export interface AccountContextProps {
  tokenId?: number;
  address?: HexStr;
}

/**
 * from a tokenId or an address, read the data about it from the
 * registry and IPFS. TokenId can be a property or set with setTokenId
 */
export const useMember = (props: AccountContextProps): AccountContextType => {
  const { address: projectAddress } = useProjectContext();
  const { aaAddress } = useAccountContext();

  /** Read Account (either one or the other) */
  if (props.tokenId !== undefined && props.address !== undefined)
    throw new Error('Both tokenId and address cant be provided');

  const _tokenIdProp =
    props.address === undefined ? (props.tokenId !== undefined ? BigInt(props.tokenId) : undefined) : undefined;

  const _addressProp = props.tokenId === undefined ? props.address || aaAddress : undefined;

  const [tokenId, _setTokenId] = useState<bigint>();
  const [address, setAddress] = useState<HexStr>();

  /** if tokenId prop changes, trigger an account read */
  useEffect(() => {
    if (_tokenIdProp) {
      _setTokenId(_tokenIdProp);
    }
  }, [_tokenIdProp]);

  /** if address prop changes, trigger a tokenIdOfAddress read */
  useEffect(() => {
    if (_addressProp) {
      setAddress(_addressProp);
    }
  }, [_addressProp]);

  const {
    data: tokenIdOfAddress,
    isLoading: isLoadingTokenId,
    refetch: refetchTokenIdOfAddress,
  } = useContractRead({
    address: projectAddress,
    abi: registryABI,
    functionName: 'tokenIdOf',
    args: address ? [address] : undefined,
    enabled: address !== undefined && projectAddress !== undefined,
  });

  /** if tokenIdOfAddress changes, update the account */
  useEffect(() => {
    if (tokenIdOfAddress) {
      _setTokenId(tokenIdOfAddress);
    }
  }, [tokenIdOfAddress]);

  const {
    refetch: refetchAccount,
    data: _accountRead,
    isLoading: isLoadingAccount,
  } = useContractRead({
    address: projectAddress,
    abi: registryABI,
    functionName: 'getAccount',
    args: tokenId ? [tokenId] : tokenIdOfAddress ? [tokenIdOfAddress] : undefined,
    enabled: (tokenId !== undefined || tokenIdOfAddress !== undefined) && projectAddress !== undefined,
  });

  const refetch = tokenId ? refetchAccount : refetchTokenIdOfAddress;

  const { data: accountVouch } = useContractRead({
    address: projectAddress,
    abi: registryABI,
    functionName: 'getTokenVouch',
    args: tokenId ? [tokenId] : undefined,
    enabled: tokenId !== undefined && projectAddress !== undefined,
  });

  const { data: voucherVouch } = useContractRead({
    address: projectAddress,
    abi: registryABI,
    functionName: 'getTokenVouch',
    args: _accountRead !== undefined ? [_accountRead.voucher] : undefined,
    enabled: _accountRead !== undefined && projectAddress !== undefined,
  });

  const { data: accountPapRead } = useQuery(['accountPap', accountVouch?.personCid], () => {
    if (accountVouch?.personCid) {
      return getEntity<PAP>(accountVouch?.personCid);
    }
  });

  const { data: voucherPapRead } = useQuery(['voucherPap', voucherVouch?.personCid], () => {
    if (voucherVouch?.personCid) {
      return getEntity<PAP>(voucherVouch?.personCid);
    }
  });

  const accountRead = _accountRead && {
    account: _accountRead.account,
    valid: _accountRead.valid,
    voucher: Number(_accountRead.voucher),
    tokenId: Number(tokenId),
  };

  return {
    refetch,
    account: accountRead,
    accountPap: accountPapRead,
    isLoadingAccount: isLoadingAccount || isLoadingTokenId,
    tokenId: Number(tokenId),
    address,
    voucherTokenId: _accountRead !== undefined ? Number(_accountRead.voucher) : undefined,
    voucherPapRead,
  };
};
