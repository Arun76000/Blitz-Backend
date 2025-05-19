// logger.middleware.ts
import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export class LoggerMiddleware {
    middleware = (req: Request, res: Response, next: NextFunction) => {

        const logDirectory = path.join(__dirname, '..', 'logs');

        if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory, { recursive: true });
        }

        // Generate a log file name based on the current date
        const logFileName = `${new Date().toISOString().split('T')[0]}-3-access.csv`;
        const logFilePath = path.join(logDirectory, logFileName);

        // Create a write stream (in append mode) for the daily log file
        const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

        if (!fs.existsSync(logFilePath) || fs.statSync(logFilePath).size === 0) {
            logStream.write(
                '"IP"   "Date"  "Method – Endpoints" "statusCode"  "host" "Client-machine"\n',
            );
        }

        // Logging middleware here using morgan middleware
        if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
            morgan('combined', { stream: logStream })(req, res, (err: any) => {
                if (err) {
                    console.error('Error in Morgan logging:', err);
                }
            });
        }

        // Morgan will log the details in development mode
        if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
            morgan('common')(req, res, (err: any) => {
                if (err) {
                    console.error('Error in Morgan logging (to console):', err);
                }
            });
        }

        next();
    };
}

// Example usage
// import { LoggerMiddleware } from './logger.middleware.js';
// const loggerMiddleware = new LoggerMiddleware().middleware;
// app.use(loggerMiddleware);