import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();

export const db = getFirestore();

export enum CollectionNames {
  Statments = 'statements',
  StatementsBackers = 'statements_backers',
}

export const collections = {
  statements: db.collection(CollectionNames.Statments),
  statementsBackers: db.collection(CollectionNames.StatementsBackers),
};
