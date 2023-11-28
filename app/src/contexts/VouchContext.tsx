import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import { registryABI } from '../utils/contracts.json';
import { HexStr } from '../types';
import { useProjectContext } from './ProjectContext';
import { useAccountContext } from '../wallet/AccountContext';
import { DecodeEventLogReturnType, encodeFunctionData, zeroAddress } from 'viem';
import { postMember } from '../utils/project';

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
  const { address, projectId } = useProjectContext();
  const { reset, addUserOp, isSuccess, isSending, events } = useAccountContext();

  const [vouchParamsInternal, setVouchParamsInternal] = useState<[HexStr, string]>();

  const setVouchParams = useCallback((account: HexStr, personCid: string) => {
    setVouchParamsInternal([account, personCid]);
  }, []);

  const checkAndPostMember = async (_events: DecodeEventLogReturnType[], _projectId: number) => {
    if (!vouchParamsInternal) throw Error('Unexpected vouchParamsInternal undefined');
    const vouchedAddress = vouchParamsInternal[0];

    const transfer = _events?.find((e) => {
      return (
        e.eventName === 'Transfer' && (e.args as any).from === zeroAddress && (e.args as any).to === vouchedAddress
      );
    });

    if (transfer) {
      await postMember({
        projectId: _projectId,
        aaAddress: vouchedAddress,
      });
    }
  };

  useEffect(() => {
    if (isSuccess && events && projectId && vouchParamsInternal) {
      checkAndPostMember(events, projectId);
    }
  }, [isSuccess, events, projectId, vouchParamsInternal]);

  const sendVouch =
    address && addUserOp && vouchParamsInternal
      ? async () => {
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
