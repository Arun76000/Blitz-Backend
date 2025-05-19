// global.middleware.ts
import { Request, Response, NextFunction } from 'express';

export interface RequestWithLang extends Request {
    lang?: string;
    [key: string]: any;
}

export class GlobalMiddleware {
    middleware(req: RequestWithLang, res: Response, next: NextFunction) {
        try {
            const userLang = req.headers['accept-language'] || 'en';
            req.lang = userLang;
            console.log("Passed from global middleware")
            next();
        } catch (error: any) {
            res.status(error.status || 500).json({
                message: error.message || 'Internal Server Error'
            });
        }
    }
}

// Example usage
// import { GlobalMiddleware } from './global.middleware.js';
// const globalMiddleware = new GlobalMiddleware().middleware;
// app.use(globalMiddleware);