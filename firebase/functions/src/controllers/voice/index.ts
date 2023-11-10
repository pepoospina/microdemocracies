import express from 'express';
import * as functions from 'firebase-functions';
import { RUNTIME_OPTIONS } from '../../config/RUNTIME_OPTIONS';

import { createStatementController } from './controllers/create.statement.controller';
import { backStatementController } from './controllers/back.statement.controller';

import { app } from '../../instances/app';

const voiceRouter = express.Router();

voiceRouter.post('/statement', createStatementController);
voiceRouter.post('/statement/back', backStatementController);

export const voiceApp = functions
  .region('europe-west1')
  .runWith({ ...RUNTIME_OPTIONS })
  .https.onRequest(app(voiceRouter));
