import { doc, onSnapshot } from 'firebase/firestore'

import { collections } from '../../firestore/database'

export const subscribeToStatements = (callback: () => void) => {
  const statements = collections.statements
  return onSnapshot(statements, (doc): void => {
    callback()
  })
}
