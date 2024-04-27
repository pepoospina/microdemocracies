import { getAddress } from 'viem'

import {
  AaOwnerPayload,
  AppApplication,
  AppInvite,
  AppProjectCreate,
  AppProjectMember,
  AppProjectMemberId,
  AppPublicIdentity,
  AppReactionCreate,
  AppStatement,
  AppStatementRead,
  AppTree,
  Entity,
  HexStr,
} from '../@shared/types'
import { getBackingId, getStatementId, getTreeId } from '../@shared/utils/identity.utils'
import { collections, db } from './db'

export const setStatementReaction = async (backing: AppReactionCreate): Promise<string> => {
  const docRef = collections
    .statementsBackers(backing.statementId)
    .doc(getBackingId(backing))
  await docRef.set(backing)

  /** keep the sum of backers updated */
  const statementRef = collections.statements.doc(backing.statementId)
  const statementData = await statementRef.get()

  if (!statementData.exists) {
    throw new Error(`Statement not found ${backing.statementId}`)
  }

  const statement = statementData.data() as AppStatementRead
  const currentnBackers = statement.nBackers !== undefined ? statement.nBackers : 0
  statement.nBackers = currentnBackers + 1

  statementRef.set(statement)

  return docRef.id
}

export const setStatement = async (
  statement: Omit<AppStatement, 'id'>,
): Promise<string> => {
  const id = getStatementId(statement.proof)
  const docRef = collections.statements.doc(id)
  await docRef.set(statement)
  return docRef.id
}

export const setIdentity = async (identity: AppPublicIdentity): Promise<string> => {
  const id = identity.aaAddress
  const docRef = collections.identities.doc(id)
  await docRef.set(identity)
  return docRef.id
}

export const createProject = async (project: AppProjectCreate): Promise<string> => {
  const projectId = project.projectId.toString()
  const ref = collections.projects.doc(projectId)
  const doc = await ref.get()

  if (doc.exists) throw new Error(`Project already exist`)

  const docRef = collections.projects.doc(projectId)
  await docRef.set(project)
  return docRef.id
}

export const setProjectMember = async (member: AppProjectMember): Promise<string> => {
  const id = member.aaAddress
  const docRef = collections.projectMembers(member.projectId.toString()).doc(id)
  await docRef.set(member)
  return docRef.id
}

export const deleteProjectMember = async (member: AppProjectMemberId): Promise<void> => {
  const id = member.aaAddress
  const docRef = collections.projectMembers(member.projectId.toString()).doc(id)
  await docRef.delete()
}

export const setTree = async (tree: AppTree): Promise<string> => {
  const treeRef = collections.trees.doc(getTreeId(tree.projectId, tree.root))
  await treeRef.set({ root: tree.root, projectId: tree.projectId })

  /** store the tree members on a subcollection */
  const treeIdentities = collections.treeIdentities(treeRef.id)
  const refs = tree.publicIds.map((publicId) => {
    return { ref: treeIdentities.doc(), data: { publicId } }
  })

  var batch = db.batch()

  refs.map((ref) => {
    batch.set(ref.ref, ref.data)
  })

  await batch.commit()

  return treeRef.id
}

export const setEntity = async (entity: Entity<any>): Promise<string> => {
  const docRef = collections.entities.doc(entity.cid)
  await docRef.set(entity)
  return docRef.id
}

export const setInvitation = async (invitation: AppInvite): Promise<string> => {
  const invitations = collections.projectInvitations(invitation.projectId.toString())
  // delete previous invitations
  const snap = await invitations
    .where('memberAddress', '==', getAddress(invitation.memberAddress))
    .get()
  await Promise.all(snap.docs.map((i) => i.ref.delete()))

  // create new
  const docRef = collections.projectInvitations(invitation.projectId.toString()).doc()
  await docRef.set(invitation)
  return docRef.id
}

export const setApplication = async (application: AppApplication): Promise<string> => {
  const docRef = collections.userApplications(application.memberAddress).doc()
  await docRef.set(application)
  return docRef.id
}

export const deleteApplications = async (address: HexStr): Promise<void> => {
  const snap = await collections.applications
    .where('papEntity.object.account', '==', address)
    .get()

  await Promise.all(
    snap.docs.map(async (doc) => {
      await doc.ref.delete()
    }),
  )
}

export const setUser = async (user: AaOwnerPayload): Promise<string> => {
  const id = user.aaAddress
  const docRef = collections.users.doc(id)
  await docRef.set({ owner: user.owner })
  return docRef.id
}
