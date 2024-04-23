import express from 'express'
import * as functions from 'firebase-functions'

import { RUNTIME_OPTIONS } from '../../config/RUNTIME_OPTIONS'
import { app } from '../../instances/app'
import { addApplicationController } from './controllers/add.entity.controller'

const projectRouter = express.Router()

projectRouter.post('/entity', addApplicationController)

export const entityApp = functions
  .region('europe-west1')
  .runWith({ ...RUNTIME_OPTIONS })
  .https.onRequest(app(projectRouter))
