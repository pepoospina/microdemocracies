import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { WriteContractResult } from '@wagmi/core';

import { registryABI } from '../utils/contracts.json';
import { HexStr } from '../types';
import { useProjectContext } from './ProjectContext';
import { useAccountContext } from '../wallet/AccountContext';
import { encodeFunctionData } from 'viem';

export type VouchContextType = {
  setVouchParams: (account: HexStr, personCid: string) => void;
  sendVouch: (() => Promise<void>) | undefined;
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
  const { address } = useProjectContext();
  const { reset, addUserOp, isSuccess, isSending } = useAccountContext();

  const [vouchParamsInternal, setVouchParamsInternal] = useState<[HexStr, string]>();

  const setVouchParams = useCallback((account: HexStr, personCid: string) => {
    setVouchParamsInternal([account, personCid]);
  }, []);

  const sendVouch =
    address && addUserOp && vouchParamsInternal
      ? async () => {
          reset();

          const callData = encodeFunctionData({
            abi: registryABI,
            functionName: 'vouch',
            args: vouchParamsInternal,
          });

          addUserOp(
            {
              target: address,
              data: callData,
              value: BigInt(0),
            },
            true
          );
        }
      : undefined;

  const isErrorSending = false;
  const errorSending = new Error();

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
