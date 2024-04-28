import { RequestHandler } from 'express'
import { logger } from 'firebase-functions/v1'

import { DeleteApplication } from '../../../@shared/types'
import { deleteApplication } from '../../../db/setters'
import { deleteApplicationValidationScheme } from './project.schemas'

export const deleteApplicationController: RequestHandler = async (request, response) => {
  const payload = (await deleteApplicationValidationScheme.validate(
    request.body,
  )) as DeleteApplication

  try {
    await deleteApplication(payload.projectId, payload.applicantAddress)
    response.status(200).send({ success: true })
  } catch (error: any) {
    logger.error('error', error)
    response.status(500).send({ success: false, error: error.message })
  }
}
