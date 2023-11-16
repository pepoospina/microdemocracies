import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();

export const db = getFirestore();

export enum CollectionNames {
  ProjectIndexes = 'projectIndexes',
  ProjectMembers = 'members',
  Trees = 'trees',
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
  trees: db.collection(CollectionNames.Trees),
  identities: db.collection(CollectionNames.Identities),
  projectIndexes: db.collection(CollectionNames.ProjectIndexes),
  projects: db.collection(CollectionNames.Projects),
  statements: db.collection(CollectionNames.Statments),
  statementsBackers: db.collection(CollectionNames.StatementsBackers),
};
