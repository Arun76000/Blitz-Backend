// import { Request, Response, NextFunction } from 'express';
// import { IUser, UserModel } from '../../model/User.model';
// import { generateToken } from '../../utils/jwt';
// import bcrypt from 'bcryptjs';

// export const register = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
//   try {
//     const { email, password, role, agencyName, agencyType, firstName, lastName } = req.body;

//     // Validate role-specific fields
//     if (role === 'agency' && (!agencyName || !agencyType)) {
//       return res.status(400).json({ message: 'Agency name and type required' });
//     }
//     if (role === 'agent' && (!firstName || !lastName)) {
//       return res.status(400).json({ message: 'First and last name required' });
//     }
//     if (role === 'admin' && (agencyName || agencyType || firstName || lastName)) {
//       return res.status(400).json({ message: 'Admin requires only email and password' });
//     }

//     const existingUser = await UserModel.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user: IUser = await UserModel.create({
//       email,
//       password: hashedPassword,
//       role,
//       agencyName,
//       agencyType,
//       firstName,
//       lastName,
//     });

//     const token = await generateToken(user?._id.toString() as string, user.role);
//     res.status(201).json({ user, token });
//   } catch (error) {
//     next(error);
//   }
// };

// export const login = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
//   try {
//     const { email, password } = req.body;
//     const user = await UserModel.findOne({ email });
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = generateToken(user._id.toString(), user.role);
//     res.json({ user, token });
//   } catch (error) {
//     next(error);
//   }
// };

import { Request, Response } from 'express';
import { AuthService } from '../../services/users/auth.service';
import { sendResponse } from '../../core/helper/helper.service';

const authService = new AuthService();

export class AuthController {
  // Register endpoint
  async register(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const { user, token } = await authService.register(userData);
      sendResponse(res, 201, "User Registered successfully.", user, { token })
      // res.status(201).json({
      //   message: 'User registered successfully',
      //   user: {
      //     _id: user._id,
      //     email: user.email,
      //     role: user.role,
      //   },
      //   token,
      // });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Login endpoint
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email = '', password = '' } = req.body;
      const { user, token } = await authService.login(email, password);

      sendResponse(res, 201, "User logged In successfully..", user, { token })
      // res.status(200).json({
      //   message: 'Login successful',
      //   user: {
      //     _id: user._id,
      //     email: user.email,
      //     role: user.role,
      //   },
      //   token,
      // });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  // Request password reset endpoint
  async requestPasswordReset(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await authService.requestPasswordReset(email);
      res.status(200).json({ message: 'Password reset link sent to email' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Reset password endpoint
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;
      await authService.resetPassword(token, newPassword);
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}