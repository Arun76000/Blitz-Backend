import jwt from 'jsonwebtoken';
import { GET_ENV_VALUES } from '../config';

export interface jwtData {
    id: string;
    role: 'agency' | 'agent' | 'admin';
    type?:string,
    iat?: number;
    exp?: number;
}
const default_JWT_SECRET = 's65f4d5s4f65ds5f1c5zxz65zxvc645xv5x6z5x54d5f5d'

export const generateToken = async (payload:jwtData): Promise<string> => {
    return await jwt.sign(payload, (GET_ENV_VALUES('JWT_SECRET') ?? default_JWT_SECRET), { expiresIn: '1d' });
};

export const DecodedToken = async (token: string): Promise<jwtData> => {
    try {
        const decoded = jwt.verify(token, (GET_ENV_VALUES('JWT_SECRET') ?? default_JWT_SECRET)) as jwtData;
        return decoded;
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token');
        } else if (error.name === 'NotBeforeError') {
            throw new Error('Token not active yet');
        } else {
            throw new Error('Token verification failed');
        }
    }
};