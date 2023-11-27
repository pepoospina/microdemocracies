import { createContext, useContext, useState } from 'react';

import { useConnectedMember } from './ConnectedAccountContext';
import { postStatement } from '../utils/statements';
import { AppStatementCreate } from '../types';
import { useProjectContext } from './ProjectContext';
import { useSemaphoreContext } from './SemaphoreContext';
import { hashMessage } from 'viem';
import { useVoiceRead } from './VoiceReadContext';

export type VoiceSendContextType = {
  proposeStatement?: (statement: string) => Promise<boolean>;
  isSuccess: boolean;
};

interface IVoiceSendContext {
  children: React.ReactNode;
}

const VoiceSendContextValue = createContext<VoiceSendContextType | undefined>(undefined);

export const VoiceSendContext = (props: IVoiceSendContext) => {
  const { tokenId } = useConnectedMember();
  const { projectId } = useProjectContext();
  const { publicId, generateProof } = useSemaphoreContext();

  const { refetchStatements } = useVoiceRead();

  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const generateStatementProof =
    projectId && publicId && generateProof !== undefined
      ? async (signal: string, nullifier: string) => {
          return generateProof(signal, nullifier, projectId);
        }
      : undefined;

  const proposeStatement =
    tokenId !== undefined && generateStatementProof !== undefined && projectId !== undefined
      ? async (_statement: string) => {
          if (projectId) {
            const statementHash = await hashMessage(_statement);
            const nullifier = Date.now().toString();
            const proofAndTree = await generateStatementProof(statementHash, nullifier);
            const statement: AppStatementCreate = {
              projectId,
              proof: proofAndTree.proof,
              treeId: proofAndTree.treeId,
              statement: _statement,
            };
            const res = await postStatement(statement);
            if (res) {
              refetchStatements();
              setIsSuccess(true);
            }
            return res;
          }
        }
      : undefined;

  return (
    <VoiceSendContextValue.Provider
      value={{
        proposeStatement,
        isSuccess,
      }}>
      {props.children}
    </VoiceSendContextValue.Provider>
  );
};

export const useVoiceSend = (): VoiceSendContextType => {
  const context = useContext(VoiceSendContextValue);
  if (!context) throw Error('context not found');
  return context;
};
