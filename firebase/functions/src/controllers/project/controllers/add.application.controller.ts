import { RequestHandler } from 'express'
import { logger } from 'firebase-functions/v1'

import { AppApply } from '../../../@app/types'
import { getInvite } from '../../../db/getters'
import { setApplication } from '../../../db/setters'
import { addApplicationValidationScheme } from './project.schemas'

export const addApplicationController: RequestHandler = async (request, response) => {
  const payload = (await addApplicationValidationScheme.validate(request.body)) as AppApply

  /** verify application id is valid */
  const invitation = await getInvite(payload.projectId, payload.invitationId)
  if (invitation === undefined) {
    throw new Error(
      `invitation ${payload.invitationId} not found on project ${payload.projectId}`,
    )
  }

  try {
    const id = await setApplication({
      ...payload,
      memberAddress: invitation.memberAddress,
    })
    response.status(200).send({ success: true, id })
  } catch (error: any) {
    logger.error('error', error)
    response.status(500).send({ success: false, error: error.message })
  }
}
