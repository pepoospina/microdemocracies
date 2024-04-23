import { RequestHandler } from 'express'
import { logger } from 'firebase-functions/v1'

import { AppProjectCreate } from '../../../@app/types'
import { createProject } from '../../../db/setters'
import { projectValidationScheme } from './project.schemas'

export const createProjectController: RequestHandler = async (request, response) => {
  const project = (await projectValidationScheme.validate(request.body)) as AppProjectCreate

  /** check the project exist onChain */

  try {
    await createProject(project)
    response.status(200).send({ success: true })
  } catch (error: any) {
    logger.error('error', error)
    response.status(500).send({ success: false, error: error.message })
  }
}
