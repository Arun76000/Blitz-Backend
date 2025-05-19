// // allExceptionsFilter.js
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import { lang, RequestExtra } from '../types/common.types';
// import { NextFunction, Request, Response } from 'express';
// import { ExpressRequest } from '../core/configuration/express-request-extend';


// /**
//  * Utility function to get response message based on status code and language
//  * This replaces the imported getResponseMessage function from NestJS
//  * 
//  * @param {number} statusCode - HTTP status code
//  * @param {string} lang - Language code
//  * @returns {Promise<string>} - Translated message
//  */
// export const getResponseMessage = async (statusCode: number, lang: lang) => {
//     // This is a simplified implementation. In a real app, you'd have translations
//     // stored in files or a database
//     const messages: Record<string, Record<number, string>> = {
//         en: {
//             400: 'Bad Request',
//             401: 'Unauthorized',
//             403: 'Forbidden',
//             404: 'Not Found',
//             500: 'Internal Server Error',
//             550: 'Custom Error',
//             // Add more status codes and translations as needed
//         },
//         // Add more languages as needed
//     };

//     // Default to English if the requested language is not available
//     const langMessages: Record<number, string> = messages[lang] || messages.en;

//     return langMessages[statusCode] || 'An unknown error occurred';
// };

// /**
//  * All Exceptions Middleware for Express
//  * This replaces the NestJS AllExceptionsFilter
//  * 
//  * @param {Object} options - Configuration options
//  * @param {Object} options.helpersService - Helper service with sendEmail method
//  * @returns {Function} - Express middleware function
//  */
// export const allExceptionsMiddleware = () => {
//     // const helpersService = options.helpersService || {
//     //     sendEmail: async () => console.log('Email sending not configured')
//     // };

//     /**
//      * @typedef {Object} MyResponseObj
//      * @property {number} statusCode - HTTP status code
//      * @property {string} message - Error message
//      * @property {boolean} flag - Success flag
//      */

//     return async (err:any, req:ExpressRequest , res:Response, next:NextFunction) => {
//         /** @type {MyResponseObj} */
//         const myResponseObj = {
//             statusCode: 500,
//             message: 'Internal Server Error',
//             flag: false,
//         };

//         // Handle HTTP exceptions (similar to NestJS HttpException)
//         if (err.status || err.statusCode) {
//             const status = err.status || err.statusCode;
//             myResponseObj.statusCode = status;

//             if (typeof err.response === 'object' && err.response && 'message' in err.response) {
//                 const messages = Array.isArray(err.response.message)
//                     ? err.response.message
//                     : [err.response.message];
//                 myResponseObj.message = messages.join(' .\n') || 'An unknown error occurred';
//             } else {
//                 myResponseObj.message = err.message;
//             }
//         } else if (err instanceof Error) {
//             myResponseObj.message = err.message || 'Internal Server Error';
//         } else {
//             myResponseObj.message = err?.message || 'Unknown error';
//         }

//         // Log in development mode
//         if (process.env.NODE_ENV === 'development') {
//             // ANSI escape codes for red color
//             console.error(
//                 '\x1b[31m%s\x1b[0m',
//                 `Status:${myResponseObj.statusCode}  Message:${myResponseObj.message}`,
//             );
//         }

//         // Handle production errors
//         if (process.env.NODE_ENV === 'production' && myResponseObj.statusCode === 500) {
//             // Create error directory if it doesn't exist
//             const errorDir = path.join(__dirname, '..', 'public', 'error');

//             try {
//                 if (!fs.existsSync(errorDir)) {
//                     fs.mkdirSync(errorDir, { recursive: true });
//                 }

//                 const errorFilePath = path.join(
//                     errorDir,
//                     `${Date.now().toString()}-error.log`,
//                 );

//                 const errorStack = err instanceof Error ? err.stack : 'No stack trace available';
//                 const errorData = `${new Date().toISOString()} - ${req.url} - ${myResponseObj.statusCode} - ${myResponseObj.message}\n ${errorStack}`;

//                 await fs.promises.appendFile(errorFilePath, errorData);

//                 // Send email notification
//                 const templateContext = {
//                     errorMessage: myResponseObj.message,
//                     requestUrl: req.url,
//                     errorTimestamp: new Date().toISOString(),
//                     ip: req.ip,
//                     companyName: process.env.COMPANY_NAME,
//                 };

//                 // await helpersService.sendEmail(
//                 //     process.env.AUTH_EMAIL,
//                 //     'TEXTSENDAPP : INTERNAL SERVER ERROR',
//                 //     'error-500.hjs',
//                 //     templateContext,
//                 // );
//             } catch (fileError) {
//                 console.error('Error writing to error log:', fileError);
//             }
//         }

//         // Get translated message
//         try {
//             const translatedMessage = await getResponseMessage(myResponseObj.statusCode, req?.lang ?? 'en');

//             if (myResponseObj.statusCode === 200) {
//                 myResponseObj.flag = true;
//             }

//             // Convert 400 status code to 202
//             if (myResponseObj.statusCode === 400) {
//                 myResponseObj.statusCode = 202;
//             }

//             myResponseObj.message =
//                 myResponseObj.statusCode >= 550
//                     ? translatedMessage
//                     : myResponseObj.message;

//             myResponseObj.statusCode =
//                 myResponseObj.statusCode >= 550
//                     ? 202 // HttpStatus.ACCEPTED
//                     : myResponseObj.statusCode;

//             return res.status(myResponseObj.statusCode).json(myResponseObj);
//         } catch (translationError) {
//             console.error('Error getting translated message:', translationError);
//             return res.status(myResponseObj.statusCode).json(myResponseObj);
//         }
//     };
// };

// export default allExceptionsMiddleware;


import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { lang } from '../types/common.types';
import { sendResponse } from '../core/helper/helper.service'


const getResponseMessage = (statusCode: number, lang: lang): string => {
  const messages: Record<string, Record<number, string>> = {
    en: {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error',
      550: 'Custom Error',
    },
  };
  const langMessages = messages[lang] || messages.en;
  return langMessages[statusCode] || 'An unknown error occurred';
};

type MyResponseObj = {
  statusCode: number;
  message: string;
  flag: boolean;
};

export const allExceptionsMiddleware = () => {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("------------------------All-exception-handle------------------------")
    const myResponseObj: MyResponseObj = {
      statusCode: 500,
      message: 'Internal Server Error',
      flag: false,
    };

    // Handle Zod validation errors
    if (err instanceof ZodError) {
      myResponseObj.statusCode = 400;
      myResponseObj.message = err.errors.map((e) => e.message).join(' | ');
    } else if (err.status || err.statusCode) {
      const status = err.status || err.statusCode;
      myResponseObj.statusCode = status;

      if (typeof err.response === 'object' && err.response?.message) {
        const messages = Array.isArray(err.response.message)
          ? err.response.message
          : [err.response.message];
        myResponseObj.message = messages.join(' .\n');
      } else {
        myResponseObj.message = err.message || 'An error occurred';
      }
    } else if (err instanceof Error) {
      myResponseObj.message = err.message;
    } else {
      myResponseObj.message = err?.message || 'Unknown error';
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('\x1b[31m%s\x1b[0m', `ERROR [${req.method} ${req.originalUrl}]:`, err);
    }

    if (process.env.NODE_ENV === 'production') {
      try {
        const errorDir = path.join(__dirname, '..', 'public', 'error');
        if (!fs.existsSync(errorDir)) fs.mkdirSync(errorDir, { recursive: true });

        const errorFilePath = path.join(errorDir, `${Date.now()}-error.log`);
        const errorDetails = `
        --- ERROR LOG ---
        Time       : ${new Date().toISOString()}
        URL        : ${req.originalUrl}
        Method     : ${req.method}
        IP         : ${req.ip}
        User-Agent : ${req.headers['user-agent']}
        Message    : ${myResponseObj.message}
        Stack      : ${err?.stack || 'No stack trace'}
        `;
        // await fs.promises.appendFile(errorFilePath, errorDetails);
      } catch (fileError) {
        console.error('Failed to write error log:', fileError);
      }
    }

    try {

      const lang = (req as any).lang || "en";
      const translatedMessage = getResponseMessage(
        myResponseObj.statusCode,
        lang
      );

      if (myResponseObj.statusCode === 200) {
        myResponseObj.flag = true;
      }

      if (myResponseObj.statusCode === 400 || myResponseObj.statusCode >= 550) {
        myResponseObj.statusCode = 202;
        myResponseObj.message = translatedMessage;
      }

      // res.status(myResponseObj.statusCode).json(myResponseObj);
      sendResponse(res, myResponseObj.statusCode, myResponseObj.message ?? '', myResponseObj);
      return
    } catch (translationError) {
      // res.status(myResponseObj.statusCode).json(myResponseObj);
      sendResponse(res, myResponseObj.statusCode, myResponseObj.message ?? '', myResponseObj);
      return
    }
  };
};

export default allExceptionsMiddleware;
