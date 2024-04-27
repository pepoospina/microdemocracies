import { RequestHandler } from 'express'
import { logger } from 'firebase-functions/v1'

import { AppPublicIdentity } from '../../../@shared/types'
import { getControlMessage } from '../../../@shared/utils/identity.utils'
import { setIdentity } from '../../../db/setters'
import { publicClient } from '../../../utils/contracts'
import { identityValidationScheme } from './voice.schemas'

export const createIdentityController: RequestHandler = async (request, response) => {
  // console.log('validate', request.body);
  const identity = (await identityValidationScheme.validate(
    request.body,
  )) as AppPublicIdentity

  // only store identities confirmed by eth addresseses
  const valid = await publicClient.verifyMessage({
    address: identity.owner,
    message: getControlMessage(identity.publicId),
    signature: identity.signature,
  })

  if (!valid) {
    throw new Error('Signature not valid')
  }

  try {
    const id = await setIdentity(identity)
    response.status(200).send({ success: true, id })
  } catch (error: any) {
    logger.error('error', error)
    response.status(500).send({ success: false, error: error.message })
  }
}
