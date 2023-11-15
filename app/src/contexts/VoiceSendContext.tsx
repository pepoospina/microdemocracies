import { createContext, useContext, useEffect, useState } from 'react';

import { Identity } from '@semaphore-protocol/identity';

import { ConnectedMemberContext, useConnectedMember } from './ConnectedAccountContext';
import { postIdentity, postStatement } from '../utils/statements';
import { AppStatementCreate } from '../types';
import { useProjectContext } from './ProjectContext';
import { useAccountContext } from '../wallet/AccountContext';
import { useAppSigner } from '../wallet/SignerContext';
import { useSignMessage } from 'wagmi';
import { getPublicIdentity } from '../firestore/getters';

export type VoiceSendContextType = {
  proposeStatement?: (statement: string) => Promise<boolean>;
};

interface IVoiceSendContext {
  children: React.ReactNode;
}

const VoiceSendContextValue = createContext<VoiceSendContextType | undefined>(undefined);

export const VoiceSendContext = (props: IVoiceSendContext) => {
  const { tokenId } = useConnectedMember();
  const { projectId } = useProjectContext();

  const proposeStatement =
    tokenId !== undefined
      ? async (_statement: string) => {
          if (tokenId && projectId) {
            const statement: AppStatementCreate = {
              projectId,
              author: tokenId,
              statement: _statement,
            };
            return postStatement(statement);
          }
        }
      : undefined;

  return (
    <VoiceSendContextValue.Provider
      value={{
        proposeStatement,
      }}>
      <ConnectedMemberContext>{props.children}</ConnectedMemberContext>
    </VoiceSendContextValue.Provider>
  );
};

export const useVoiceSend = (): VoiceSendContextType => {
  const context = useContext(VoiceSendContextValue);
  if (!context) throw Error('context not found');
  return context;
};
