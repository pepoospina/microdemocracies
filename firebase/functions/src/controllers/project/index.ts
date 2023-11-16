import express from 'express';
import * as functions from 'firebase-functions';
import { RUNTIME_OPTIONS } from '../../config/RUNTIME_OPTIONS';

import { createProjectController } from './controllers/create.project.controller';
import { addMemberController } from './controllers/add.member.controller';

import { app } from '../../instances/app';

const projectRouter = express.Router();

projectRouter.post('/create', createProjectController);
projectRouter.post('/member', addMemberController);

export const projectApp = functions
  .region('europe-west1')
  .runWith({ ...RUNTIME_OPTIONS })
  .https.onRequest(app(projectRouter));
