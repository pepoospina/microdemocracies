import { createContext, useContext, useState } from 'react';

import { postBacking, postStatement } from '../utils/statements';
import { AppBackingCreate, AppStatementCreate } from '../types';
import { useProjectContext } from './ProjectContext';
import { useSemaphoreContext } from './SemaphoreContext';
import { hashMessage } from 'viem';
import { useVoiceRead } from './VoiceReadContext';

export type VoiceSendContextType = {
  proposeStatement?: (statement: string) => Promise<boolean>;
  isSuccessStatement: boolean;
  backStatement?: (statementId: string, treeId: string) => Promise<boolean>;
  isSuccessBacking: boolean;
};

interface IVoiceSendContext {
  children: React.ReactNode;
}

const VoiceSendContextValue = createContext<VoiceSendContextType | undefined>(undefined);

export const VoiceSendContext = (props: IVoiceSendContext) => {
  const { projectId } = useProjectContext();
  const { publicId, generateProof } = useSemaphoreContext();

  const { refetchStatements } = useVoiceRead();

  const [isSuccessStatement, setIsSuccessStatement] = useState<boolean>(false);
  const [isSuccessBacking, setIsSuccessBacking] = useState<boolean>(false);

  const generateStatementProof =
    projectId && publicId && generateProof !== undefined
      ? async (signal: string, nullifier: string) => {
          return generateProof({ signal, nullifier, projectId });
        }
      : undefined;

  const proposeStatement =
    generateStatementProof !== undefined && projectId !== undefined
      ? async (_statement: string) => {
          setIsSuccessStatement(false);
          if (projectId) {
            const statementHash = hashMessage(_statement);
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
              setIsSuccessStatement(true);
            }
            return res;
          }
        }
      : undefined;

  const generateBackingProof =
    generateProof !== undefined
      ? async (statementId: string, treeId: string) => {
          return generateProof({ signal: statementId, nullifier: statementId, treeId });
        }
      : undefined;

  const backStatement = generateBackingProof
    ? async (statementId: string, treeId: string) => {
        setIsSuccessBacking(false);
        const proofAndTree = await generateBackingProof(statementId, treeId);

        const backing: AppBackingCreate = {
          statementId,
          proof: proofAndTree.proof,
        };

        const res = await postBacking(backing);

        if (res) {
          setIsSuccessBacking(true);
        }
        return res;
      }
    : undefined;

  return (
    <VoiceSendContextValue.Provider
      value={{
        proposeStatement,
        isSuccessStatement,
        backStatement,
        isSuccessBacking,
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
