import express from 'express';

import {  createWorkspaceController ,deletedWorkspaceController,getAllWorkspaceController,getWorkspaceByJoinCodeController, getWorkspaceController,updateWrokspaceController} from '../../controllers/workspaceController.js';
import { isAuthenticated } from '../../middleware/authMiddleware.js';
import { createWorkspaceSchema } from '../../validators/workspaceSchema.js';
import { validate } from '../../validators/zodValidator.js';

const router = express.Router();

router.post(
  '/',
  isAuthenticated,
  validate(createWorkspaceSchema),
  createWorkspaceController
);
router.get('/', isAuthenticated, getWorkspaceController);

router.delete('/:workspaceId', isAuthenticated, deletedWorkspaceController);

router.get('/:workspaceId', isAuthenticated, getAllWorkspaceController);

router.get('/join/:joinCode',isAuthenticated,getWorkspaceByJoinCodeController)

router.put('/:workspaceId',isAuthenticated,updateWrokspaceController)

// router.post('/members/:workspaceId',isAuthenticated,addMemberToWorkspaceController)

export default router;
