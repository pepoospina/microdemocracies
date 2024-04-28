import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

import { CollectionNames } from '../@shared/collectionNames'

initializeApp()

export const db = getFirestore()

export const collections = {
  users: db.collection(CollectionNames.Users),
  projects: db.collection(CollectionNames.Projects),
  projectInvitations: (projectId: string) =>
    db
      .collection(CollectionNames.Projects)
      .doc(projectId)
      .collection(CollectionNames.ProjectInvitations),
  memberApplications: (projectId: string) =>
    db
      .collection(CollectionNames.Projects)
      .doc(projectId)
      .collection(CollectionNames.Applications),
  projectMembers: (projectId: string) =>
    db
      .collection(CollectionNames.Projects)
      .doc(projectId)
      .collection(CollectionNames.ProjectMembers),
  identities: db.collection(CollectionNames.Identities),
  treeIdentities: (treeId: string) =>
    db
      .collection(CollectionNames.Trees)
      .doc(treeId)
      .collection(CollectionNames.TreeIdentities),
  entities: db.collection(CollectionNames.Entities),
  trees: db.collection(CollectionNames.Trees),
  statements: db.collection(CollectionNames.Statements),
  statementsBackers: (statementId: string) =>
    db
      .collection(CollectionNames.Statements)
      .doc(statementId)
      .collection(CollectionNames.StatementsBackers),
}
