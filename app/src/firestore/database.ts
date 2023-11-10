import { initializeApp } from 'firebase/app';
import { collection, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD9VYdQS_C_4hCi-_nT18TvvgqKhWEkR9o',
  authDomain: 'network-state-registry.firebaseapp.com',
  projectId: 'network-state-registry',
  storageBucket: 'network-state-registry.appspot.com',
  messagingSenderId: '45801391482',
  appId: '1:45801391482:web:f60f473d1c562d9d25c2c3',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// connectFirestoreEmulator(db, 'localhost', 8080);

export enum CollectionNames {
  Statments = 'statements',
  StatementsBackers = 'statements_backers',
}

export const collections = {
  statements: collection(db, CollectionNames.Statments),
  statementsBackers: collection(db, CollectionNames.StatementsBackers),
};
