import { createContext, useContext, useEffect, useState } from 'react';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useAccount, useConnect, useContractRead, useDisconnect, usePublicClient, useQuery } from 'wagmi';

import { RegistryAbi, VouchEventAbi, registryAddress } from '../utils/contracts.json';
import { ConnectedAccountContext } from './ConnectedAccountContext';
import { AppVouch, HexStr } from '../types';
import { connect, disconnect } from '@wagmi/core';

export type RegistryContextType = {
  nMembers?: number;
  refetch: (options?: { throwOnError: boolean; cancelRefetch: boolean }) => Promise<any>;
  isLoading: boolean;
  connect: ReturnType<typeof useConnect>['connect'];
  disconnect: ReturnType<typeof useDisconnect>['disconnect'];
  isConnected: boolean;
  connectedAddress?: HexStr;
  allVouches?: AppVouch[];
};

interface IRegistryContext {
  children: React.ReactNode;
}

const RegistryContextValue = createContext<RegistryContextType | undefined>(undefined);

export const RegistryContext = (props: IRegistryContext) => {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { isConnected, address: connectedAddress } = useAccount();

  const publicClient = usePublicClient();

  // all vouches
  const { data: vouchEvents } = useQuery(['allVoucheEvents'], async () => {
    const logs = await (publicClient as any).getLogs({
      address: registryAddress,
      event: VouchEventAbi,
      fromBlock: 'earliest',
      toBlock: 'latest',
    });

    return logs;
  });

  const [allVouches, setAllVouches] = useState<AppVouch[]>();

  useEffect(() => {
    if (!publicClient || !vouchEvents) return;

    Promise.all(
      vouchEvents.map(async (e: any) => {
        const block = await (publicClient as any).getBlock(e.blockNumber);
        return {
          from: e.args.from.toString(),
          to: e.args.to.toString(),
          personCid: e.args.personCid,
          vouchDate: +block.timestamp.toString(),
        };
      })
    ).then((vouches) => setAllVouches(vouches));
  }, [vouchEvents, publicClient]);

  const {
    refetch,
    data: nMembers,
    isLoading,
  } = useContractRead({
    address: registryAddress,
    abi: RegistryAbi,
    functionName: 'totalSupply',
  });

  return (
    <RegistryContextValue.Provider
      value={{
        nMembers: nMembers !== undefined ? Number(nMembers) : undefined,
        refetch,
        isLoading,
        connect,
        disconnect,
        isConnected,
        connectedAddress,
        allVouches,
      }}>
      <ConnectedAccountContext>{props.children}</ConnectedAccountContext>
    </RegistryContextValue.Provider>
  );
};

export const useRegistry = (): RegistryContextType => {
  const context = useContext(RegistryContextValue);
  if (!context) throw Error('context not found');
  return context;
};
