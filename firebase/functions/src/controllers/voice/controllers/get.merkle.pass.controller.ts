import { RequestHandler } from 'express'
import { logger } from 'firebase-functions/v1'

import { AppGetMerklePass } from '../../../@shared/types'
import { getGroupOfTree, getLatestGroup, storeTree } from '../../../utils/groups'
import { getIdentitiesValidationScheme } from './voice.schemas'

export const getMerklePassController: RequestHandler = async (request, response) => {
  const payload = (await getIdentitiesValidationScheme.validate(
    request.body,
  )) as AppGetMerklePass

  let treeId: string | undefined = undefined

  try {
    const group = await (async () => {
      if (payload.projectId && !payload.treeId) {
        const group = await getLatestGroup(payload.projectId)
        /** always store a tree if not yet created */
        treeId = await storeTree(payload.projectId, group)
        return group
      }
      if (payload.treeId) {
        treeId = payload.treeId
        return getGroupOfTree(payload.treeId)
      }
      throw new Error('Unexpeted case, provide projecId or treeId')
    })()

    const leafIndex = group.indexOf(BigInt(payload.publicId))
    const merklePass = group.generateMerkleProof(leafIndex)

    const merklePassStr = JSON.stringify(merklePass, (key, value) => {
      return typeof value === 'bigint' ? value.toString() : value
    })

    response.status(200).send({ merklePassStr, treeId, depth: group.depth })
  } catch (error: any) {
    if (error)
      if (error.message.toLowerCase().includes('leaf does not exist')) {
        response.status(403).send({ success: false, error: 'leaf does not exist' })
      } else {
        logger.error('error', error)
        response.status(500).send({ success: false, error: error.message })
      }
  }
}
