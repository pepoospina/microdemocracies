import { Group } from '@semaphore-protocol/group';

import { AppPublicIdentity, AppTree } from '../@app/types';

import { getProjectIdentities, getTree } from '../db/getters';
import { setTree } from '../db/setters';

export const TREE_DEPTH = 18;

export interface SerializedSemaphoreGroup {
  id: string;
  name: string;
  members: string[];
  depth: number;
  zeroValue: string;
  merkleRoot: string;
}

export const getTreeId = (tree: AppTree) => {
  return `${tree.projectId}-${tree.root.slice(0, 16)}`;
};

export const sortIdentities = (identities: AppPublicIdentity[]) => {
  return identities.sort((a, b) =>
    a.publicId > b.publicId ? 1 : a.publicId === b.publicId ? 0 : -1
  );
};

export const getGroup = async (projectId: number) => {
  const identities = await getProjectIdentities(projectId);
  const identitiesSorted = sortIdentities(identities);

  const serializedGroup: Omit<SerializedSemaphoreGroup, 'merkleRoot'> = {
    name: `microrevolutions-${projectId}`,
    id: `${projectId}`,
    depth: TREE_DEPTH, // 262,144 members
    members: identitiesSorted.map((id) => id.publicId),
    zeroValue: '0',
  };

  return deserializeSemaphoreGroup(serializedGroup);
};

export function serializeSemaphoreGroup(
  group: Group,
  name: string
): SerializedSemaphoreGroup {
  return {
    id: group.id.toString(),
    name,
    members: group.members.map((m) => m.toString()),
    depth: group.depth,
    zeroValue: group.zeroValue.toString(),
    merkleRoot: group.merkleTree.root.toString(),
  };
}

export function deserializeSemaphoreGroup(
  serializedGroup: Omit<SerializedSemaphoreGroup, 'merkleRoot'>
) {
  const group = new Group(
    BigInt(serializedGroup.id),
    serializedGroup.depth,
    serializedGroup.members.map((m) => BigInt(m))
  );
  return group;
}

export const storeTree = async (projectId: number, group: Group) => {
  const serialized = serializeSemaphoreGroup(group, 'dummy name');

  const tree: AppTree = {
    projectId,
    root: serialized.merkleRoot,
  };
  const id = await getTree(tree);

  if (!id) {
    return setTree(tree);
  } else {
    return id;
  }
};
