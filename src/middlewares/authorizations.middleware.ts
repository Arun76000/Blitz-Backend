// authorization.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {ProfileService} from '../services/users/profile.service';
import * as HelpersService from '../core/helper/helper.service';
import { DecodedToken } from '../utils/jwt';

export interface UserRequest extends Request {
    roleId?: any;
    user?: any;
    is_super?: boolean;
    roleLevel?: number;
    mobile?: string;
    [key: string]: any;
}

export class Authorization {
    private readonly profileService;
    constructor(profileService:ProfileService){
        this.profileService=new ProfileService()
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
                return HelpersService.sendResponse(
                    res,
                    401,
                    'No token provided',
                );
            }

            //   const decoded = await this.helper.decodeJwtToken(token);
            const decoded = await DecodedToken(token)

            const user = await this.profileService.findOneAUth(decoded.id);

            if (!user || decoded.role !== user.role.toString()) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            req.user = user;
            req.roleId = decoded.role;
            next();
        } catch (error: any) {
            console.log("🚀 ~ Authorization ~ use ~ error:", error.message);

            if (error.name === 'TokenExpiredError') {
                return HelpersService.sendResponse(
                    res,
                    401,
                    'Token expired',
                );
            }
            return res.status(401).json({ message: 'Unauthorized' });
        }
    };
}

// Example usage
// import { Authorization } from './authorization.middleware.js';
// const authMiddleware = new Authorization(usersService, helperService).middleware;
// app.use('/protected-routes', authMiddleware);