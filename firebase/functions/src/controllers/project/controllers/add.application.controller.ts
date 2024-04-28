import { RequestHandler } from 'express'
import { logger } from 'firebase-functions/v1'

import { AppApplication, AppApply } from '../../../@shared/types'
import { getInvite } from '../../../db/getters'
import { setApplication } from '../../../db/setters'
import { addApplicationValidationScheme } from './project.schemas'

export const addApplicationController: RequestHandler = async (request, response) => {
  try {
    const payload = (await addApplicationValidationScheme.validate(
      request.body,
    )) as AppApply

    const application: AppApplication = {
      papEntity: payload.papEntity,
      projectId: payload.projectId,
    }

    if (payload.invitationId) {
      /** if invitationId is valid, the application is linked to an existing member */
      const invitation = await getInvite(payload.projectId, payload.invitationId)

      if (invitation === undefined) {
        throw new Error(
          `invitation ${payload.invitationId} not found on project ${payload.projectId}`,
        )
      }

      application.memberAddress = invitation.memberAddress
    }

    const id = await setApplication(application)

    response.status(200).send({ success: true, id })
  } catch (error: any) {
    logger.error('error', error)
    response.status(500).send({ success: false, error: error.message })
  }
}
