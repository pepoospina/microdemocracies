import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();

export const db = getFirestore();

export enum CollectionNames {
  ProjectMembers = 'members',
  Identities = 'identities',
  Projects = 'projects',
  Statments = 'statements',
  StatementsBackers = 'statements_backers',
}

export const collections = {
  projectMembers: (projectId: string) =>
    db
      .collection(CollectionNames.Projects)
      .doc(projectId)
      .collection(CollectionNames.ProjectMembers),
  identities: db.collection(CollectionNames.Identities),
  projects: db.collection(CollectionNames.Projects),
  statements: db.collection(CollectionNames.Statments),
  statementsBackers: db.collection(CollectionNames.StatementsBackers),
};
