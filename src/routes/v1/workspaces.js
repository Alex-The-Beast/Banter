import express from 'express';

import {
  addChannelToWorkspaceController,
  addMemberToWorkspaceController,
  createWorkspaceController,
  deletedWorkspaceController,
  getAllWorkspaceController,
  getWorkspaceByJoinCodeController,
  getWorkspaceController,
  updateWrokspaceController
} from '../../controllers/workspaceController.js';
import { isAuthenticated } from '../../middleware/authMiddleware.js';
import {
  addMemberToWorkspaceSchema,
  createWorkspaceSchema,
  addChannelToWorkspaceSchema
} from '../../validators/workspaceSchema.js';
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

router.get(
  '/join/:joinCode',
  isAuthenticated,
  getWorkspaceByJoinCodeController
);

router.put('/:workspaceId', isAuthenticated, updateWrokspaceController);

router.put(
  '/:workspaceId/members',
  isAuthenticated,
  validate(addMemberToWorkspaceSchema),
  addMemberToWorkspaceController
);

router.put(
  '/:workspaceId/channels',
  isAuthenticated,
  validate(addChannelToWorkspaceSchema),
  addChannelToWorkspaceController
);

export default router;
