import { RequestHandler } from 'express'
import { logger } from 'firebase-functions/v1'

import { getProjectMembers } from '../../../db/setters'
import { getMembersValidationScheme } from './project.schemas'

export const getProjectMembersController: RequestHandler = async (request, response) => {
  const payload = (await getMembersValidationScheme.validate(request.body)) as {
    projectId: number
  }

  /** verify application id is valid */

  try {
    const members = await getProjectMembers(payload.projectId)
    response.status(200).send({ success: true, members })
  } catch (error: any) {
    logger.error('error', error)
    response.status(500).send({ success: false, error: error.message })
  }
}
