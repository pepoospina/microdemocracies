import express from 'express';
import * as functions from 'firebase-functions';
import { RUNTIME_OPTIONS } from '../../config/RUNTIME_OPTIONS';

import { app } from '../../instances/app';
import { setAaOwnerController } from './controllers/set.aaowner.controller';

const voiceRouter = express.Router();

voiceRouter.post('/setAaOwner', setAaOwnerController);

export const usersApp = functions
  .region('europe-west1')
  .runWith({ ...RUNTIME_OPTIONS })
  .https.onRequest(app(voiceRouter));
