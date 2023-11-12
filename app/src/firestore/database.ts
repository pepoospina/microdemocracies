import { initializeApp } from 'firebase/app';
import { collection, connectFirestoreEmulator, doc, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD0Mg8hk5cQAfNc-ZNM-pM_76kZY4IXxM4',
  authDomain: 'microrevolutions-a6bcf.firebaseapp.com',
  projectId: 'microrevolutions-a6bcf',
  storageBucket: 'microrevolutions-a6bcf.appspot.com',
  messagingSenderId: '960631524467',
  appId: '1:960631524467:web:a50a27aeaaa3c5990eee06',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
connectFirestoreEmulator(db, '127.0.0.1', 8080);

export enum CollectionNames {
  Projects = 'projects',
  Statments = 'statements',
  StatementsBackers = 'statements_backers',
}

export const collections = {
  project: (id: number) => doc(db, CollectionNames.Projects, id.toString()),
  projects: collection(db, CollectionNames.Projects),
  statements: collection(db, CollectionNames.Statments),
  statementsBackers: collection(db, CollectionNames.StatementsBackers),
};
