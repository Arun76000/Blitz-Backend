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
const router = Router();

const authController = new AuthController();
// const profileController = new ProfileController();

// Auth Routes
router.post('/register', validateRequest(baseUserZod), (req: Request, res: Response) => authController.register(req, res));
router.post('/login', validateRequest(loginZod), (req: Request, res: Response) => authController.login(req, res));
router.post('/request-password-reset', validateRequest(forgotPasswordZod), (req: Request, res: Response) =>
    authController.requestPasswordReset(req, res)
);
router.post('/auth/reset-password', validateRequest(resetPasswordZod), (req: Request, res: Response) => authController.resetPassword(req, res));

export default router;