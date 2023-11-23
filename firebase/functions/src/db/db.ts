import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import { CollectionNames } from '../@app/firestore/collectionNames';

initializeApp();

export const db = getFirestore();

export const collections = {
  userApplications: (aaAddress: string) =>
    db
      .collection(CollectionNames.Identities)
      .doc(aaAddress)
      .collection(CollectionNames.UserApplications),
  projectInvitations: (projectId: string) =>
    db
      .collection(CollectionNames.Projects)
      .doc(projectId)
      .collection(CollectionNames.ProjectInvitations),
  projectMembers: (projectId: string) =>
    db
      .collection(CollectionNames.Projects)
      .doc(projectId)
      .collection(CollectionNames.ProjectMembers),
  applications: db.collection(CollectionNames.Applications),
  trees: db.collection(CollectionNames.Trees),
  identities: db.collection(CollectionNames.Identities),
  projectIndexes: db.collection(CollectionNames.ProjectIndexes),
  projects: db.collection(CollectionNames.Projects),
  statements: db.collection(CollectionNames.Statments),
  statementsBackers: db.collection(CollectionNames.StatementsBackers),
};
