import { RequestHandler } from 'express'
import { logger } from 'firebase-functions/v1'

import { HexStr } from '../../../@app/types'
import { deleteApplications } from '../../../db/setters'
import { deleteApplicationValidationScheme } from './project.schemas'

export const deleteApplicationController: RequestHandler = async (request, response) => {
  const payload = (await deleteApplicationValidationScheme.validate(request.body)) as {
    address: HexStr
  }

  try {
    await deleteApplications(payload.address)
    response.status(200).send({ success: true })
  } catch (error: any) {
    logger.error('error', error)
    response.status(500).send({ success: false, error: error.message })
  }
}
