import { useCallback, useEffect, useState } from 'react';
import {
  DecodeEventLogReturnType,
  encodeFunctionData,
  zeroAddress,
} from 'viem';
import { usePublicClient } from 'wagmi';

import { HexStr } from '../types';
import {
  TransferEventType,
  VouchEventType,
  registryABI,
} from '../utils/contracts.json';
import { postMember } from '../utils/project';
import { useAccountContext } from '../wallet/AccountContext';
import { useProjectContext } from './ProjectContext';

export type VouchHookType = {
  setVouchParams: (account: HexStr, personCid: string) => void;
  sendVouch: (() => Promise<void>) | undefined;
  isSending: boolean;
  isErrorSending: boolean;
  errorSending: Error | null;
  isSuccess: boolean;
};

export const useVouch = (): VouchHookType => {
  /** Vouch */
  const publicClient = usePublicClient();

  const { address, projectId, refetch: refetchProject } = useProjectContext();
  const { sendUserOps, isSuccess, isSending, events } = useAccountContext();

  const [vouchParamsInternal, setVouchParamsInternal] =
    useState<[HexStr, string]>();

  const setVouchParams = useCallback((account: HexStr, personCid: string) => {
    setVouchParamsInternal([account, personCid]);
  }, []);

  const checkAndPostMember = async (
    _events: DecodeEventLogReturnType[],
    _projectId: number
  ) => {
    if (!vouchParamsInternal)
      throw Error('Unexpected vouchParamsInternal undefined');
    if (!address) throw Error('Unexpected address undefined');

    const vouchedAddress = vouchParamsInternal[0];

    const transfer = _events?.find((e: any) => {
      if (e.eventName === 'Transfer') {
        const event = e as TransferEventType;
        return (
          event.args.from === zeroAddress && event.args.to === vouchedAddress
        );
      }
    }) as TransferEventType | undefined;

    /** get the tokenId of the vouched address */
    const vouchedTokenId = publicClient
      ? await publicClient.readContract({
          address: address,
          abi: registryABI,
          args: [vouchedAddress],
          functionName: 'tokenIdOf',
        })
      : undefined;

    /** find the exact vouch event */
    const vouch = _events?.find((e: any) => {
      if (e.eventName === 'VouchEvent') {
        const event = e as VouchEventType;
        return event.args.to === vouchedTokenId;
      }
    }) as VouchEventType | undefined;

    if (!transfer || !vouch) {
      throw Error('Unexpected transfer or vouch event not found');
    }

    if (transfer && vouch) {
      await postMember({
        projectId: _projectId,
        aaAddress: vouchedAddress,
        tokenId: Number(vouch.args.to),
        voucherTokenId: Number(vouch.args.from),
      });

      refetchProject();
    }
  };

  useEffect(() => {
    if (events && projectId && vouchParamsInternal) {
      checkAndPostMember(events, projectId);
    }
  }, [events, projectId, vouchParamsInternal]);

  const sendVouch =
    address && sendUserOps && vouchParamsInternal
      ? async () => {
          const callData = encodeFunctionData({
            abi: registryABI,
            functionName: 'vouch',
            args: vouchParamsInternal,
          });

          sendUserOps([
            {
              target: address,
              data: callData,
              value: BigInt(0),
            },
          ]);
        }
      : undefined;

  const isErrorSending = false;
  const errorSending = new Error();

  return {
    setVouchParams,
    sendVouch,
    isSending,
    isErrorSending,
    errorSending,
    isSuccess,
  };
};
