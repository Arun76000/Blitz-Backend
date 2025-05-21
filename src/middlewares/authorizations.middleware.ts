// authorization.middleware.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { ProfileService } from '../services/users/profile.service';
import * as HelpersService from '../core/helper/helper.service';
import { DecodedToken } from '../utils/jwt';
import { asyncHandler } from '../utils/asyncHandler';
import { IUser } from '../model/User.model';

export interface UserRequest extends Request {
    roleId?: any;
    user?: any;
    is_super?: boolean;
    roleLevel?: number;
    mobile?: string;
    [key: string]: any;
}

class Authorization {
    private readonly profileService;
    constructor(profileService: ProfileService) {
        this.profileService = new ProfileService()
    }

    middleware = async (req: UserRequest, res: Response, next: NextFunction) => {
        try {
            let token = null;
            if (req.headers.authorization) {
                token = req.headers.authorization.split(' ')[1];
            }
            if (!token && req.cookies?.jwtToken) {
                token = req.cookies.jwtToken;
            }
            if (!token) {
                HelpersService.sendResponse(
                    res,
                    401,
                    'No token provided',
                );
                return
            }

            //   const decoded = await this.helper.decodeJwtToken(token);
            const decoded = await DecodedToken(token)

            const user = await this.profileService.findOneAUth(decoded.id);

            if (!user || decoded.role !== user.role.toString()) {
                HelpersService.sendResponse(res, 401, 'Unauthorized')
                return
                // return res.status(401).json({ message: 'Unauthorized' });
            }

            req.user = user;
            req.roleId = decoded.role;
            next();
        } catch (error: any) {
            console.log("🚀 ~ Authorization ~ use ~ error:", error.message);

            if (error.name === 'TokenExpiredError') {
                HelpersService.sendResponse(
                    res,
                    401,
                    'Token expired',
                );
                return
            }
            // res.status(401).json({ message: 'Unauthorized' });
            HelpersService.sendResponse(res, 401, 'Unauthorized')
            return
        }
    };
}

// Example usage
// import { Authorization } from './authorization.middleware.js';
// export const authMiddleware = new Authorization(new ProfileService()).middleware;
export const authMiddleware: RequestHandler = new Authorization(new ProfileService()).middleware;

// export const AuthorizationMiddleware = Authorization;

// app.use('/protected-routes', authMiddleware);

// Role guard middleware
export const roleGuard = (roles: string[]) => {
    return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as IUser;
        if (!user || !roles.includes(user.role)) {
            //   res.status(403).json({ message: 'Unauthorized' });
            HelpersService.sendResponse(res, 403, 'forbidden Resource.')
            return;
        }
        next();
    });
};