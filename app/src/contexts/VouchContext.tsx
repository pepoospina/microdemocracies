import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { WriteContractResult } from '@wagmi/core';

import { registryABI } from '../utils/contracts.json';
import { HexStr } from '../types';
import { useProjectContext } from './ProjectContext';

export type VouchContextType = {
  setVouchParams: (account: HexStr, personCid: string) => void;
  sendVouch: (() => Promise<WriteContractResult>) | undefined;
  isSending: boolean;
  isErrorSending: boolean;
  errorSending: Error | null;
  isSuccess: boolean;
};

const VouchContextValue = createContext<VouchContextType | undefined>(undefined);

export interface VouchContextProps {
  children: ReactNode;
}

export const VouchContext = (props: VouchContextProps) => {
  /** Vouch */
  const { registryAddress } = useProjectContext();
  const [vouchParamsInternal, setVouchParamsInternal] = useState<[HexStr, string]>();

  const setVouchParams = useCallback((account: HexStr, personCid: string) => {
    setVouchParamsInternal([account, personCid]);
  }, []);

  const { config: vouchConfig } = usePrepareContractWrite({
    address: registryAddress,
    abi: registryABI,
    args: vouchParamsInternal,
    functionName: 'vouch',
  });

  const {
    data: transaction,
    writeAsync: sendVouch,
    isError: _isErrorWriting,
    error: _errorWriting,
  } = useContractWrite(vouchConfig);

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
    <VouchContextValue.Provider
      value={{
        setVouchParams,
        sendVouch,
        isSending,
        isErrorSending,
        errorSending,
        isSuccess,
      }}>
      {props.children}
    </VouchContextValue.Provider>
  );
};

export const useVouch = (): VouchContextType => {
  const context = useContext(VouchContextValue);
  if (!context) throw Error('context not found');
  return context;
};
