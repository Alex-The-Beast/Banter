import express from 'express';

import { createWorkspaceController ,deletedWorkspaceController,getWorkspaceController} from '../../controllers/workspaceController.js';
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

export default router;
