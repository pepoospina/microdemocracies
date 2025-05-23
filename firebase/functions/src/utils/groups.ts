import { Group } from '@semaphore-protocol/group'

import { AppTree } from '../@shared/types'
import { getTreeId } from '../@shared/utils/identity.utils'
import { getProjectIdentities, getTree, getTreeFull } from '../db/getters'
import { setTree } from '../db/setters'

export interface SerializedSemaphoreGroup {
  id: string
  name: string
  members: string[]
  merkleRoot: string
}

export const sortIdentities = (identities: { publicId: string }[]) => {
  return identities.sort((a, b) =>
    a.publicId > b.publicId ? 1 : a.publicId === b.publicId ? 0 : -1,
  )
}

export const getLatestGroup = async (projectId: number) => {
  const identities = await getProjectIdentities(projectId)
  const identitiesSorted = sortIdentities(identities)

  const serializedGroup: Omit<SerializedSemaphoreGroup, 'merkleRoot'> = {
    name: `microdemocracies-${projectId}`,
    id: `${projectId}`,
    members: identitiesSorted.map((id) => id.publicId),
  }

  return deserializeSemaphoreGroup(serializedGroup)
}

export const getGroupOfTree = async (treeId: string) => {
  const tree = await getTreeFull(treeId)

  const serializedGroup: Omit<SerializedSemaphoreGroup, 'merkleRoot'> = {
    name: `microdemocracies-treeId:${treeId}`,
    id: `${tree.projectId}`,
    members: tree.publicIds,
  }

  return deserializeSemaphoreGroup(serializedGroup)
}

export function serializeSemaphoreGroup(
  group: Group,
  name: string,
): SerializedSemaphoreGroup {
  return {
    id: group.root.toString(),
    name,
    members: group.members.map((m) => m.toString()),
    merkleRoot: group.root.toString(),
  }
}

export function deserializeSemaphoreGroup(
  serializedGroup: Omit<SerializedSemaphoreGroup, 'merkleRoot'>,
) {
  const group = new Group(serializedGroup.members.map((m) => BigInt(m)))
  return group
}

export const storeTree = async (projectId: number, group: Group) => {
  const serialized = serializeSemaphoreGroup(group, 'dummy name')

  const tree: AppTree = {
    projectId,
    root: serialized.merkleRoot,
    publicIds: group.members.map((m) => m.toString()),
  }

  const treeId = getTreeId(tree.projectId, tree.root)
  const readTree = await getTree(treeId)

  if (!readTree) {
    return setTree(tree)
  } else {
    return readTree.id
  }
}
