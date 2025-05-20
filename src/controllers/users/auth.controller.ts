import { Request, Response } from 'express';
import { AuthService } from '../../services/users/auth.service';
import { sendResponse } from '../../core/helper/helper.service';

const authService = new AuthService();

export class AuthController {
  // Register endpoint
  async register(req: Request, res: Response): Promise<void> {
    const userData = req.body;
    const { user, token } = await authService.register(userData);
    sendResponse(res, 201, "User Registered successfully.", user, { token })
  }

  // Login endpoint
  async login(req: Request, res: Response): Promise<void> {
    const { email = '', password = '' } = req.body;
    const { user, token } = await authService.login(email, password);

    sendResponse(res, 200, "User logged In successfully..", user, { token })
  }

  // Request password reset endpoint
  async requestPasswordReset(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    await authService.requestPasswordReset(email);
    sendResponse(res, 200, "Password reset link sent to email")
  }

  // Reset password endpoint
  async resetPassword(req: Request, res: Response): Promise<void> {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    sendResponse(res, 200, "Password reset successfully")
  }
}