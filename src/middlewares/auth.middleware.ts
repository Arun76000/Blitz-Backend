// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import { GET_ENV_VALUES } from '../config/env';
// import { IUser, UserModel } from '../model/User.model';
// import { asyncHandler } from '../utils/asyncHandler'; // Adjust path

// // Extend Express Request to include `user`
// declare module 'express-serve-static-core' {
//   interface Request {
//     user?: IUser;
//   }
// }

// interface DecodedToken {
//   id: string;
//   role: 'agency' | 'agent' | 'admin';
// }

// // Auth middleware
// export const auth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) {
//     res.status(401).json({ message: 'No token provided' });
//     return;
//   }

//   const decoded = jwt.verify(token, GET_ENV_VALUES('JWT_SECRET') as string) as DecodedToken;

//   const user = await UserModel.findById(decoded.id);
//   if (!user) {
//     res.status(401).json({ message: 'User not found' });
//     return;
//   }

//   req.user = user as IUser;
//   next();
// });

// // Role guard middleware
// export const roleGuard = (roles: string[]) => {
//   return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     const user = req.user as IUser;
//     if (!user || !roles.includes(user.role)) {
//       res.status(403).json({ message: 'Unauthorized' });
//       return;
//     }
//     next();
//   });
// };

