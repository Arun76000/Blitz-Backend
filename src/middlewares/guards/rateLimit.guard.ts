import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { ExpressRequest } from '../../core/configuration/express-request-extend';

// Middleware factory for rate limiting
export function createRateLimitMiddleware(
    windowMs: number,
    maxReq: number,
    customMessage?: string
) {
    const limiter = rateLimit({
        windowMs,
        max: maxReq,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req: Request, res: Response) => {
            const customReq = req as ExpressRequest;
            const msg = customMessage || 'Too many requests from this IP,';
            const resetTime = new Date(customReq.rateLimit.resetTime);
            const now = new Date();
            const retryAfter = Math.ceil((resetTime.getTime() - now.getTime()) / 1000);

            const retryAfterMinutes = Math.floor(retryAfter / 60);
            const remainingSeconds = retryAfter % 60;
            const responseMessage = `${msg} Try again in ${retryAfterMinutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds} minute(s).`;

            res.setHeader('Retry-After', retryAfter.toString());
            res.setHeader('X-RateLimit-Limit', customReq.rateLimit.limit.toString());
            res.setHeader('X-RateLimit-Remaining', customReq.rateLimit.remaining.toString());
            res.setHeader('X-RateLimit-Reset', resetTime.toISOString());

            res.status(429).json({
                flag: false,
                message: responseMessage,
            });
        }
    });

    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await new Promise<void>((resolve, reject) => {
            limiter(req, res, (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        next();
    };
}