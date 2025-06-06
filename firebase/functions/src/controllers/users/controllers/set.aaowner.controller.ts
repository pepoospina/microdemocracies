import { RequestHandler } from 'express'
import { logger } from 'firebase-functions/v1'

import { AaOwnerPayload } from '../../../@shared/types'
import { getAccountAddress } from '../../../@shared/utils/aa-sdk'
import { setUser } from '../../../db/setters'
import { chain, publicClient } from '../../../utils/contracts'
import { setAaOwnerValidationScheme } from './users.schemas'

export const setAaOwnerController: RequestHandler = async (request, response) => {
  const payload = (await setAaOwnerValidationScheme.validate(
    request.body,
  )) as AaOwnerPayload

  /** derive the aaAddress from the owner as validation
   */
  const aaAddressVer = await getAccountAddress(payload.owner, publicClient as any, chain)

  if (!aaAddressVer || aaAddressVer.toLowerCase() !== payload.aaAddress.toLowerCase()) {
    throw new Error(`Unexpected aaAddress for owner ${payload.owner}`)
  }

  try {
    await setUser(payload)
    response.status(200).send({ success: true })
  } catch (error: any) {
    logger.error('error', error)
    response.status(500).send({ success: false, error: error.message })
  }
}
