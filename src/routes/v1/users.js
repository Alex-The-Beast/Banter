import express from 'express';

import { signUp } from '../../controllers/userController.js';
import { validate } from '../../validators/zodValidator.js';
import { userSignupSchema } from '../../validators/userSchema.js';
const router = express.Router();

router.post('/signup', validate(userSignupSchema), signUp);

export default router;
