import { Request } from "express";
import { lang } from "../../types/common.types";
import { IUser, UserModel } from '../..//model/User.model';

export interface ExpressRequest extends Request {
    // rateLimit?: {
    //     resetTime: Date;
    //     remaining: number;
    //     limit: number;
    // };
    roleId?: string;
    lang?: lang;//string;
    mobile?: string;
    roleLevel?: number;
    role: 'agency' | 'agent' | 'admin';
    files: any;
    user?: any;//{ userId: string; role: 'agency' | 'agent' | 'admin' };
    rateLimit: {
        limit: number;
        current: number;
        remaining: number;
        resetTime: Date;
    };
    // rateLimit?:any;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
  }
}