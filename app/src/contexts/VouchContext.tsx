import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

import { registryAddress, RegistryFactoryAbi } from '../utils/contracts.json';
import { HexStr } from '../types';

export type CreateProjectContextType = {
  setCreateParams: (founder: HexStr) => void;
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
  /** Vouch */
  const [createParamsInternal, setCreateParamsInternal] = useState<[HexStr]>();

  const setCreateParams = useCallback((founder: HexStr) => {
    setCreateParamsInternal([founder]);
  }, []);

  const { config: createConfig } = usePrepareContractWrite({
    address: registryAddress,
    abi: RegistryFactoryAbi,
    args: createParamsInternal,
    functionName: 'createRegistry',
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
