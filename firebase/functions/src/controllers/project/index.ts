import express from 'express'
import * as functions from 'firebase-functions'

import { RUNTIME_OPTIONS } from '../../config/RUNTIME_OPTIONS'
import { app } from '../../instances/app'
import { addApplicationController } from './controllers/add.application.controller'
import { addInvitationController } from './controllers/add.invitation.controller'
import { addMemberController } from './controllers/add.member.controller'
import { createProjectController } from './controllers/create.project.controller'
import { deleteApplicationController } from './controllers/delete.application.controller'
import { invalidateMemberController } from './controllers/invalidate.member.controller'

const projectRouter = express.Router()

projectRouter.post('/deleteApplication', deleteApplicationController)
projectRouter.post('/apply', addApplicationController)
projectRouter.post('/newInvite', addInvitationController)
projectRouter.post('/create', createProjectController)
projectRouter.post('/member/invalidate', invalidateMemberController)
projectRouter.post('/member', addMemberController)

export const projectApp = functions
  .region('europe-west1')
  .runWith({ ...RUNTIME_OPTIONS })
  .https.onRequest(app(projectRouter))
