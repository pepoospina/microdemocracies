import { createContext, useContext } from 'react';
import { useSignMessage } from 'wagmi';

import { ConnectedMemberContext, useConnectedMember } from './ConnectedAccountContext';
import { postStatement } from '../utils/statements';
import { AppStatementCreate } from '../types';
import { useProjectContext } from './ProjectContext';

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
  const { signMessageAsync } = useSignMessage();

  const proposeStatement =
    tokenId !== undefined
      ? async (_statement: string) => {
          if (tokenId && signMessageAsync && projectId) {
            const statement: AppStatementCreate = {
              projectId,
              author: tokenId,
              statement: _statement,
            };
            return postStatement(statement, signMessageAsync);
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
