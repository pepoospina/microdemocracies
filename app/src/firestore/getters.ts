import {
  doc as docRef,
  getCountFromServer,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { getAddress } from 'viem'

import { MIN_LIKES_PUBLIC } from '../config/appConfig'
import {
  AppApplication,
  AppProject,
  AppProjectMember,
  AppPublicIdentity,
  Entity,
  HexStr,
  StatementRead,
} from '../shared/types'
import { postInvite } from '../utils/project'
import { collections } from './database'

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
    where('nBackers', '>=', MIN_LIKES_PUBLIC),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)

  return snap.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id,
    } as unknown as StatementRead
  })
}

export const getProjectMembers = async (projectId: number) => {
  const q = query(collections.projectMembers(projectId), orderBy('joinedAt', 'desc'))
  const snap = await getDocs(q)

  return snap.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id,
    } as unknown as AppProjectMember & { id: string }
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
    return await postInvite({ projectId, memberAddress: aaAddress })
  }

  const doc = querySnapshot.docs[0]
  return doc.id
}

export const inviterApplicationsQuery = (projectId: number, aaAddress: HexStr) => {
  const applications = collections.memberApplications(projectId)
  return query(applications, where('memberAddress', '==', getAddress(aaAddress)))
}

export const getInviterApplications = async (projectId: number, aaAddress: HexStr) => {
  const q = inviterApplicationsQuery(projectId, aaAddress)
  const querySnapshot = await getDocs(q)

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

export const getTokenIdOfAddress = async (projectId: number, aaAddress: string) => {
  const ref = docRef(collections.projectMembers(projectId), aaAddress)
  const doc = await getDoc(ref)

  if (!doc.exists()) return undefined
  const member = doc.data() as { tokenId: number }
  return member.tokenId
}
