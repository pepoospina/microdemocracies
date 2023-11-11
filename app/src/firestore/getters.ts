import { getDocs, where, query, and, getDoc } from 'firebase/firestore';
import { collections } from './database';
import { AppProject, StatementBackerRead, StatementRead } from '../types';

export const getProject = async (projectId: number) => {
  const ref = collections.project(projectId);
  const doc = await getDoc(ref);

  console.log({ doc, docData: doc.data(), docexist: doc.exists(), docId: doc.id });

  return {
    ...doc.data(),
    id: doc.id,
  } as unknown as AppProject;
};

export const getTopStatements = async () => {
  const statements = await getDocs(collections.statements);
  return statements.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id,
    } as unknown as StatementRead;
  });
};

export const getStatementBackers = async (statementId: string) => {
  const q = query(collections.statementsBackers, where('object.statementId', '==', statementId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id,
    } as unknown as StatementBackerRead;
  });
};

export const isStatementBacker = async (statementId: string, tokenId: number): Promise<boolean> => {
  const q = query(
    collections.statementsBackers,
    and(where('object.statementId', '==', statementId), where('object.backer', '==', tokenId))
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.length === 1;
};
