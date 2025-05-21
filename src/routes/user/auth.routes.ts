// import express from 'express';
// import { register, login } from '../../controllers/users/auth.controller';

// const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);

// export default router;




import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { AuthController } from '../../controllers/users/auth.controller';
import { ExpressRequest } from '../../core/configuration/express-request-extend';
import { roleType } from '../../types/common.types';
import { validateRequest } from '../../middlewares/validationRequest.middleware';
import { loginZod } from '../../core/ZOD/authvaliators/login.validator';
import { baseUserZod } from '../../core/ZOD/baseuser.validator';
import { forgotPasswordZod } from '../../core/ZOD/authvaliators/forgot-password.validator';
import { resetPasswordZod } from '../../core/ZOD/authvaliators/reset-password.validator';
import { asyncHandler } from '../../utils/asyncHandler';
import { agentZod } from '../../core/ZOD/agent.validator';
import { agencyZod } from '../../core/ZOD/agency.validator';
import { catchAsync } from '../../core/helper/helper.service';
import { authMiddleware } from '../../middlewares/authorizations.middleware';
const router = Router();

const authController = new AuthController();
// const profileController = new ProfileController();

// Auth Routes

router.post('/register', authMiddleware, validateRequest(baseUserZod), asyncHandler(authController.register));
router.post('/register-agent', authMiddleware, validateRequest(agentZod), asyncHandler(authController.register));
router.post('/register-agency', authMiddleware, validateRequest(agencyZod), asyncHandler(authController.register));
router.post('/login', validateRequest(loginZod), asyncHandler(authController.login));
router.post('/request-password-reset', validateRequest(forgotPasswordZod), asyncHandler(authController.requestPasswordReset));
router.post('/reset-password', validateRequest(resetPasswordZod), asyncHandler(authController.resetPassword));

export default router;