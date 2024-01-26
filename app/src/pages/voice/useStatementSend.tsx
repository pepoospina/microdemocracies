import { useEffect, useState } from 'react';

import { postStatement } from '../../utils/statements';
import { AppStatementCreate } from '../../types';
import { useProjectContext } from '../../contexts/ProjectContext';
import { useSemaphoreContext } from '../../contexts/SemaphoreContext';
import { hashMessage } from 'viem';

export type VoiceSendContextType = {
  proposeStatement?: (statement: string) => Promise<boolean>;
  isSuccessStatement: boolean;
};

export const useStatementSend = (): VoiceSendContextType => {
  const { projectId, refetchStatements } = useProjectContext();
  const { publicId, generateProof } = useSemaphoreContext();

  const [isSuccessStatement, setIsSuccessStatement] = useState<boolean>(false);

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

  useEffect(() => {
    if (isSuccessStatement) {
      setIsSuccessStatement(false);
    }
  }, [isSuccessStatement]);

  return {
    proposeStatement,
    isSuccessStatement,
  };
};
