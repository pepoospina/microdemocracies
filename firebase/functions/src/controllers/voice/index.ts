import express from 'express'
import * as functions from 'firebase-functions'

import { RUNTIME_OPTIONS } from '../../config/RUNTIME_OPTIONS'
import { app } from '../../instances/app'
import { createIdentityController } from './controllers/create.identity.controller'
import { createStatementController } from './controllers/create.statement.controller'
import { getMerklePassController } from './controllers/get.merkle.pass.controller'
import { reactToStatementController } from './controllers/react.to.statement.controller'

const voiceRouter = express.Router()

voiceRouter.post('/merklepass/get', getMerklePassController)
voiceRouter.post('/identity', createIdentityController)
voiceRouter.post('/statement', createStatementController)
voiceRouter.post('/statement/back', reactToStatementController)

export const voiceApp = functions
  .region('europe-west1')
  .runWith({ ...RUNTIME_OPTIONS })
  .https.onRequest(app(voiceRouter))
