import express from 'express';
import * as functions from 'firebase-functions';
import { RUNTIME_OPTIONS } from '../../config/RUNTIME_OPTIONS';

import { createIdentityController } from './controllers/create.identity.controller';
import { createStatementController } from './controllers/create.statement.controller';
import { reactToStatementController } from './controllers/react.statement.controller';
import { getMerklePassController } from './controllers/get.merkle.pass.controller';

import { app } from '../../instances/app';

const voiceRouter = express.Router();

voiceRouter.post('/merklepass/get', getMerklePassController);
voiceRouter.post('/identity', createIdentityController);
voiceRouter.post('/statement', createStatementController);
voiceRouter.post('/statement/back', reactToStatementController);

export const voiceApp = functions
  .region('europe-west1')
  .runWith({ ...RUNTIME_OPTIONS })
  .https.onRequest(app(voiceRouter));
