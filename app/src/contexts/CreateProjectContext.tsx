import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

import { RegistryFactoryAbi } from '../utils/contracts.json';
import { HexStr } from '../types';
import { utils } from 'ethers';
import { useRegistry } from './RegistryContext';

interface Founder {
  address: HexStr;
  personCid: string;
}

export type CreateProjectContextType = {
  setCreateParams: (founders: Founder[]) => void;
  sendCreateProject: (() => void) | undefined;
  isSending: boolean;
  isErrorSending: boolean;
  errorSending: Error | null;
  isSuccess: boolean;
};

const CreateProjectContextValue = createContext<CreateProjectContextType | undefined>(undefined);

export interface CreateProjectContextProps {
  children: ReactNode;
}

export const CreateProjectContext = (props: CreateProjectContextProps) => {
  const { registryAddress } = useRegistry();

  /** Vouch */
  const [createParamsInternal, setCreateParamsInternal] =
    useState<[string, string, readonly `0x${string}`[], readonly string[], `0x${string}`]>();

  const setCreateParams = useCallback((founders: Founder[]) => {
    const addresses = founders.map((f) => f.address);
    const foundersPersonsCids = founders.map((f) => f.personCid);

    const salt = utils.keccak256(utils.toUtf8Bytes(Date.now().toString())) as `0x${string}`;
    setCreateParamsInternal(['MRV', 'MicroRevolution ', addresses, foundersPersonsCids, salt]);
  }, []);

  const { config: createConfig } = usePrepareContractWrite({
    address: registryAddress,
    abi: RegistryFactoryAbi,
    args: createParamsInternal,
    functionName: 'create',
  });

  const {
    data: transaction,
    write: sendCreateProject,
    isError: _isErrorWriting,
    error: _errorWriting,
  } = useContractWrite(createConfig);

  const {
    isLoading: isSending,
    isError: _isErrorWaiting,
    error: _errorWaiting,
    isSuccess,
  } = useWaitForTransaction({
    hash: transaction?.hash,
  });

  const isErrorSending = _isErrorWriting || _isErrorWaiting;
  const errorSending = _errorWriting ? _errorWriting : _errorWaiting ? _errorWaiting : null;

  return (
    <CreateProjectContextValue.Provider
      value={{
        setCreateParams,
        sendCreateProject,
        isSending,
        isErrorSending,
        errorSending,
        isSuccess,
      }}>
      {props.children}
    </CreateProjectContextValue.Provider>
  );
};

export const useCreateProject = (): CreateProjectContextType => {
  const context = useContext(CreateProjectContextValue);
  if (!context) throw Error('context not found');
  return context;
};
