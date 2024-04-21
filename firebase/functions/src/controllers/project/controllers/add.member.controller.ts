import { RequestHandler } from 'express'
import { logger } from 'firebase-functions/v1'

import { AppProjectMember } from '../../../@app/types'
import { getProject } from '../../../db/getters'
import { setProjectMember } from '../../../db/setters'
import { getRegistry } from '../../../utils/contracts'
import { addMemberValidationScheme } from './project.schemas'

export const addMemberController: RequestHandler = async (request, response) => {
  const payload = (await addMemberValidationScheme.validate(
    request.body,
  )) as AppProjectMember

  /** check the project exist onChain */
  const project = await getProject(payload.projectId)
  const contract = getRegistry(project.address)
  const balance = await contract.read.balanceOf([payload.aaAddress])

  if (balance === BigInt(0)) throw new Error(`Address ${payload.aaAddress} not a member`)

  try {
    setProjectMember(payload)
    response.status(200).send({ success: true })
  } catch (error: any) {
    logger.error('error', error)
    response.status(500).send({ success: false, error: error.message })
  }
}
