import { Group } from '@semaphore-protocol/group';

import { getIdentities } from '../db/getters';

export interface SerializedSemaphoreGroup {
  id: string;
  name: string;
  members: string[];
  depth: number;
  zeroValue: string;
}

export const getGroup = async (projectId: number) => {
  const identities = await getIdentities(projectId);

  const serializedGroup: SerializedSemaphoreGroup = {
    name: '',
    id: `microrevolutions-${projectId}`,
    depth: 18, // 262,144 members
    members: identities.map((id) => id.publicId),
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
  };
}

export function deserializeSemaphoreGroup(
  serializedGroup: SerializedSemaphoreGroup
) {
  const group = new Group(
    BigInt(serializedGroup.id),
    serializedGroup.depth,
    serializedGroup.members.map((m) => BigInt(m))
  );
  return group;
}
