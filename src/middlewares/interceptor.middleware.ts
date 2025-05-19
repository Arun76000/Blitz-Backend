import { Request, Response, NextFunction } from 'express';

export function interceptorMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  console.log(`\n--- Incoming Request ---`);
  console.log(`${req.method} ${req.originalUrl}`);
  console.log(`Headers:`, req.headers);
  if (req.method !== 'GET') {
    console.log(`Body:`, req.body);
  }

  const originalSend = res.send.bind(res);

  res.send = (body?: any): Response => {
    const duration = Date.now() - start;
    console.log(`\n--- Outgoing Response ---`);
    console.log(`Status: ${res.statusCode}`);
    console.log(`Response Body:`, body);
    console.log(`Execution Time: ${duration}ms`);
    return originalSend(body);
  };

  next();
}
