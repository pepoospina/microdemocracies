import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useContractRead } from 'wagmi';

import { RegistryAbi } from '../utils/contracts.json';
import { AppAccount, AppVouch, Entity, HexStr, PAP } from '../types';
import { useQuery } from 'react-query';
import { getEntity } from '../utils/store';
import { useRegistry } from './ProjectContext';

export type AccountContextType = {
  refetch: (options?: { throwOnError: boolean; cancelRefetch: boolean }) => Promise<any>;
  accountRead?: AppAccount;
  accountPapRead?: Entity<PAP>;
  vouchRead?: AppVouch;
  voucherPapRead?: Entity<PAP>;
  isLoadingAccount: boolean;
  voucherTokenId?: number;
  tokenId?: number;
  address?: string;
  setTokenId: (tokenId: number) => void;
  setAddress: (address: HexStr) => void;
};

const AccountContextValue = createContext<AccountContextType | undefined>(undefined);

export interface AccountContextProps {
  tokenId?: number;
  address?: HexStr;
  children: ReactNode;
}

/**
 * from a tokenId or an address, read the data about it from the
 * registry and IPFS. TokenId can be a property or set with setTokenId
 */
export const MemberContext = (props: AccountContextProps) => {
  const { registryAddress } = useRegistry();

  /** Read Account */
  const _tokenIdProp = props.tokenId !== undefined ? BigInt(props.tokenId) : undefined;
  const _addressProp = props.address;

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

  /** if setTokenId is called, trigger an account read */
  const setTokenId = (_tokenId: number) => {
    _setTokenId(BigInt(_tokenId));
  };

  const {
    data: tokenIdOfAddress,
    isLoading: isLoadingTokenId,
    refetch: refetchTokenIdOfAddress,
  } = useContractRead({
    address: registryAddress,
    abi: RegistryAbi,
    functionName: 'tokenIdOf',
    args: address ? [address] : undefined,
    enabled: address !== undefined,
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
    address: registryAddress,
    abi: RegistryAbi,
    functionName: 'getAccount',
    args: tokenId ? [tokenId] : tokenIdOfAddress ? [tokenIdOfAddress] : undefined,
    enabled: tokenId !== undefined || tokenIdOfAddress !== undefined,
  });

  const refetch = tokenId ? refetchAccount : refetchTokenIdOfAddress;

  const { data: accountVouch } = useContractRead({
    address: registryAddress,
    abi: RegistryAbi,
    functionName: 'getTokenVouch',
    args: tokenId ? [tokenId] : undefined,
    enabled: tokenId !== undefined,
  });

  const { data: voucherVouch } = useContractRead({
    address: registryAddress,
    abi: RegistryAbi,
    functionName: 'getTokenVouch',
    args: _accountRead !== undefined ? [_accountRead.voucher] : undefined,
    enabled: _accountRead !== undefined,
  });

  const { data: accountPapRead } = useQuery(['accountPap', accountVouch?.personCid], () => {
    if (accountVouch?.personCid) {
      return getEntity(accountVouch?.personCid);
    }
  });

  const { data: voucherPapRead } = useQuery(['voucherPap', voucherVouch?.personCid], () => {
    if (voucherVouch?.personCid) {
      return getEntity(voucherVouch?.personCid);
    }
  });

  const accountRead = _accountRead && {
    account: _accountRead.account,
    valid: _accountRead.valid,
    voucher: Number(_accountRead.voucher),
  };

  return (
    <AccountContextValue.Provider
      value={{
        refetch,
        accountRead,
        accountPapRead,
        isLoadingAccount: isLoadingAccount || isLoadingTokenId,
        tokenId: Number(tokenId),
        address,
        voucherTokenId: _accountRead !== undefined ? Number(_accountRead.voucher) : undefined,
        voucherPapRead,
        setTokenId,
        setAddress,
      }}>
      {props.children}
    </AccountContextValue.Provider>
  );
};

export const useTokenAccount = (): AccountContextType => {
  const context = useContext(AccountContextValue);
  if (!context) throw Error('context not found');
  return context;
};
