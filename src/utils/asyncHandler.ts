import { Request, Response, NextFunction } from 'express';

// Type for async handler functions
type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

/**
 * Wraps an async function to handle promise rejections and pass errors to Express's next function.
 * @param fn - The async middleware or route handler function
 * @returns A wrapped function compatible with Express
 */
export const asyncHandler = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.error('AsyncHandler Error:', err);
      next(err);
    });
  };
};