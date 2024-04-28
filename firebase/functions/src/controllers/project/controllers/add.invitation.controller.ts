import { RequestHandler } from 'express'
import { logger } from 'firebase-functions/v1'

import { AppInvite } from '../../../@shared/types'
import { setInvitation } from '../../../db/setters'
import { addInvitationValidationScheme } from './project.schemas'

export const addInvitationController: RequestHandler = async (request, response) => {
  const payload = (await addInvitationValidationScheme.validate(request.body)) as AppInvite

  try {
    const id = await setInvitation(payload)
    response.status(200).send({ success: true, id })
  } catch (error: any) {
    logger.error('error', error)
    response.status(500).send({ success: false, error: error.message })
  }
}
