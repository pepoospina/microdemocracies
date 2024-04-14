import {
  getDocs,
  where,
  query,
  getDoc,
  doc as docRef,
  getCountFromServer,
  orderBy,
} from 'firebase/firestore'
import { collections } from './database'
import {
  AppApplication,
  AppProject,
  AppPublicIdentity,
  Entity,
  HexStr,
  StatementRead,
} from '../types'
import { postInvite } from '../utils/project'
import { getAddress } from 'viem'

export const getProject = async (projectId: number) => {
  const ref = collections.project(projectId)
  const doc = await getDoc(ref)

  return {
    ...doc.data(),
    id: doc.id,
  } as unknown as AppProject
}

export const getAccountProjects = async (aaAddress: HexStr) => {
  const q = query(
    collections.members,
    where('aaAddress', '==', aaAddress),
    orderBy('projectId', 'desc'),
  )
  const snap = await getDocs(q)

  const projectIds = snap.docs.map((doc) => {
    return doc.data().projectId
  })

  const projects = await Promise.all(
    projectIds.map((pId) => {
      return getProject(pId)
    }),
  )

  console.log({ projects })

  return projects
}

export const getTopStatements = async (projectId: number) => {
  const q = query(
    collections.statements,
    where('projectId', '==', projectId),
    where('nBackers', '>=', 2),
  )
  const snap = await getDocs(q)

  return snap.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id,
    } as unknown as StatementRead
  })
}

export const getStatement = async (statementId: string) => {
  const ref = collections.statement(statementId)
  const doc = await getDoc(ref)

  if (!doc.exists) {
    return undefined
  }

  return {
    ...doc.data(),
    id: doc.id,
  } as unknown as StatementRead
}

export const countStatementBackings = async (statementId: string) => {
  const backers = collections.statementsBackers(statementId)
  const q = query(backers)
  const snap = await getCountFromServer(q)
  return snap.data().count
}

export const getInviteId = async (projectId: number, aaAddress: HexStr) => {
  const invites = collections.projectInvites(projectId)
  const q = query(invites, where('memberAddress', '==', getAddress(aaAddress)))
  const querySnapshot = await getDocs(q)

  if (querySnapshot.docs.length === 0) {
    console.log('user invite not found creating new one', { projectId, aaAddress })
    return await postInvite({ projectId, memberAddress: aaAddress, creationDate: 0 })
  }

  const doc = querySnapshot.docs[0]
  return doc.id
}

export const getApplications = async (aaAddress: HexStr) => {
  const applications = collections.userApplications(aaAddress)
  const querySnapshot = await getDocs(applications)

  return querySnapshot.docs.map((app) => {
    return {
      ...app.data(),
    } as AppApplication
  })
}

export const getPublicIdentity = async (aaAddress: HexStr) => {
  const ref = collections.identity(aaAddress)
  const doc = await getDoc(ref)

  if (!doc.exists()) return undefined

  return {
    ...doc.data(),
  } as unknown as AppPublicIdentity
}

export const getEntityFirestore = async <T>(cid: string) => {
  const ref = docRef(collections.entities, cid)
  const doc = await getDoc(ref)

  if (!doc.exists()) return undefined

  return {
    ...doc.data(),
  } as unknown as Entity<T>
}

export const getAccountOwner = async (aaAddress: HexStr) => {
  const ref = docRef(collections.users, aaAddress)
  const doc = await getDoc(ref)

  const user = doc.data() as { owner: HexStr }
  return user.owner
}
