import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();

export const db = getFirestore();

export enum CollectionNames {
  Identities = 'identities',
  Projects = 'projects',
  Statments = 'statements',
  StatementsBackers = 'statements_backers',
}

export const collections = {
  identities: (projectId: string) =>
    db
      .collection(CollectionNames.Projects)
      .doc(projectId)
      .collection(CollectionNames.Identities),

  projects: db.collection(CollectionNames.Projects),

  statements: db.collection(CollectionNames.Statments),

  statementsBackers: db.collection(CollectionNames.StatementsBackers),
};
