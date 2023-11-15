import { createContext, useContext, useEffect, useState } from 'react';

import { ConnectedMemberContext, useConnectedMember } from './ConnectedAccountContext';
import { postStatement } from '../utils/statements';
import { AppStatementCreate } from '../types';
import { useProjectContext } from './ProjectContext';
import { useSemaphoreContext } from './SemaphoreContext';
import { hashMessage, stringToBytes } from 'viem';
import { hashObject } from '../utils/cid-hash';

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
  const { publicId, generateProof } = useSemaphoreContext();

  const proposeStatement =
    tokenId !== undefined && generateProof !== undefined && projectId !== undefined
      ? async (_statement: string) => {
          if (projectId) {
            const statementHash = await hashMessage(_statement);
            const nullifier = Date.now().toString();
            const proof = await generateProof(statementHash, nullifier);
            const statement: AppStatementCreate = {
              projectId,
              proof,
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
