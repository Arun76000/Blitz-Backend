// import fs from 'fs';
// import path from 'path';
// import { NextFunction, Request, Response } from 'express';
// import { ZodError } from 'zod';
// import { lang } from '../types/common.types';
// import { sendResponse } from '../core/helper/helper.service';
// import { GET_ENV_VALUES } from '../config';

// const getResponseMessage = (statusCode: number, lang: lang): string => {
//   const messages: Record<string, Record<number, string>> = {
//     en: {
//       400: 'Bad Request',
//       401: 'Unauthorized',
//       403: 'Forbidden',
//       404: 'Not Found',
//       500: 'Internal Server Error',
//       550: 'Custom Error',
//     },
//   };
//   const langMessages = messages[lang] || messages.en;
//   return langMessages[statusCode] || 'An unknown error occurred';
// };

// type ResponseObj = {
//   statusCode: number;
//   message: string;
//   flag: boolean;
//   data?: any;
// };

// export const allExceptionsMiddleware = () => {
//   return (err: any, req: Request, res: Response, next: NextFunction) => {
//     console.log("------------------------All-exception-handle------------------------");

//     const responseObj: ResponseObj = {
//       statusCode: 500,
//       message: 'Internal Server Error',
//       flag: false,
//     };

//     // Handle Zod validation errors
//     if (err instanceof ZodError) {
//       responseObj.statusCode = 400;
//       responseObj.message = err.errors.map((e) => e.message).join(' | ');
//     }
//     // Handle custom HttpExceptions or errors with status codes
//     else if (err.statusCode || err.status) {
//       const status = err.statusCode || err.status;
//       responseObj.statusCode = status;

//       if (typeof err.response === 'object' && err.response?.message) {
//         const messages = Array.isArray(err.response.message)
//             ? err.response.message
//             : [err.response.message];
//         responseObj.message = messages.join(' .\n');
//       } else if (typeof err.response === 'string') {
//         responseObj.message = err.response;
//       } else {
//         responseObj.message = err.message || 'An error occurred';
//       }

//       // Include any additional data from the response
//       if (err.response && typeof err.response === 'object' && err.response.data) {
//         responseObj.data = err.response.data;
//       }
//     }
//     // Handle standard Error objects
//     else if (err instanceof Error) {
//       responseObj.message = err.message;
//     }
//     // Handle other error types
//     else {
//       responseObj.message = err?.message || 'Unknown error';
//     }

//     // Log error in development mode
//     if (GET_ENV_VALUES('NODE_ENV') === 'development') {
//       console.error('\x1b[31m%s\x1b[0m', `ERROR [${req.method} ${req.originalUrl}]:`, err);
//     }

//     // Log error to file in production mode
//     if (GET_ENV_VALUES('NODE_ENV') === 'production') {
//       try {
//         const errorDir = path.join(__dirname, '..', 'public', 'error');
//         if (!fs.existsSync(errorDir)) fs.mkdirSync(errorDir, { recursive: true });

//         const errorFilePath = path.join(errorDir, `${Date.now()}-error.log`);
//         const errorDetails = `
//         --- ERROR LOG ---
//         Time       : ${new Date().toISOString()}
//         URL        : ${req.originalUrl}
//         Method     : ${req.method}
//         IP         : ${req.ip}
//         User-Agent : ${req.headers['user-agent']}
//         Message    : ${responseObj.message}
//         Stack      : ${err?.stack || 'No stack trace'}
//         `;

//         fs.writeFileSync(errorFilePath, errorDetails);
//       } catch (fileError) {
//         console.error('Failed to write error log:', fileError);
//       }
//     }

//     try {
//       const lang = (req as any).lang || "en";
//       const translatedMessage = getResponseMessage(responseObj.statusCode, lang);

//       // Set flag to true for successful responses (which shouldn't reach this middleware anyway)
//       if (responseObj.statusCode === 200) {
//         responseObj.flag = true;
//       }

//       // Handle special cases for certain status codes
//       if (responseObj.statusCode === 400 || responseObj.statusCode >= 550) {
//         // Keep the original status code in responseObj but send 202 as HTTP status
//         const originalStatusCode = responseObj.statusCode;
//         responseObj.statusCode = originalStatusCode;
//         responseObj.message = translatedMessage;

//         // Send with HTTP status 202 but keep original status in the response object
//         sendResponse(res, 202, responseObj.message, responseObj);
//         return;
//       }

//       // Send response with appropriate status code
//       sendResponse(res, responseObj.statusCode, responseObj.message, responseObj);
//     } catch (translationError) {
//       // Fallback in case of error during response preparation
//       sendResponse(res, responseObj.statusCode, responseObj.message, responseObj);
//     }
//   };
// };









import fs from 'fs';
import path from 'path';
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { lang } from '../types/common.types';
import { sendResponse } from '../core/helper/helper.service';
import { GET_ENV_VALUES } from '../config';
import { ApiException, ApiError } from '../utils/ApiError';

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

export const allExceptionsMiddleware = () => {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("------------------------All-exception-handle------------------------");

    let apiError: ApiError = {
      statusCode: 500,
      message: 'Internal Server Error',
      error: 'InternalServerError',
      flag: false,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      details: {},
    };

    // Handle ApiException
    if (err instanceof ApiException) {
      apiError = err.toResponse(req.originalUrl);
    }
    // Handle Zod validation errors
    else if (err instanceof ZodError) {
      apiError.statusCode = 400;
      apiError.error = 'BadRequest';
      apiError.message = err.errors.map((e) => e.message).join(' | ');
      apiError.details = { validationErrors: err.errors };
    }
    // Handle errors with status codes (e.g., legacy HttpExceptions)
    else if (err.statusCode || err.status) {
      const status = err.statusCode || err.status;
      apiError.statusCode = status;
      apiError.error = err.name || 'UnknownError';

      if (typeof err.response === 'object' && err.response?.message) {
        const messages = Array.isArray(err.response.message)
          ? err.response.message
          : [err.response.message];
        apiError.message = messages.join(' .\n');
        apiError.details = err.response.data || {};
      } else if (typeof err.response === 'string') {
        apiError.message = err.response;
      } else {
        apiError.message = err.message || 'An error occurred';
      }
    }
    // Handle standard Error objects
    else if (err instanceof Error) {
      apiError.message = err.message;
      apiError.details = { stack: err.stack };
    }
    // Handle other error types
    else {
      apiError.message = err?.message || 'Unknown error';
      apiError.details = { rawError: err };
    }

    // Log error in development mode
    if (GET_ENV_VALUES('NODE_ENV') === 'development') {
      console.error('\x1b[31m%s\x1b[0m', `ERROR [${req.method} ${req.originalUrl}]:`, err);
    }

    // Log error to file in production mode
    if (GET_ENV_VALUES('NODE_ENV') === 'production') {
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
        Message    : ${apiError.message}
        Stack      : ${err?.stack || 'No stack trace'}
        Details    : ${JSON.stringify(apiError.details, null, 2)}
        `;

        fs.writeFileSync(errorFilePath, errorDetails);
      } catch (fileError) {
        console.error('Failed to write error log:', fileError);
      }
    }

    try {
      const langValue = (req as any).lang || 'en';
      const translatedMessage = getResponseMessage(apiError.statusCode, langValue);

      // Handle special cases for certain status codes
      if (apiError.statusCode === 400 || apiError.statusCode >= 550) {
        // Keep the original status code in apiError but send 202 as HTTP status
        apiError.message = translatedMessage;
        sendResponse(res, 202, translatedMessage, apiError);
        return;
      }

      // Send response with appropriate status code
      sendResponse(res, apiError.statusCode, translatedMessage, apiError);
    } catch (translationError) {
      // Fallback in case of error during response preparation
      sendResponse(res, apiError.statusCode, apiError.message, apiError);
    }
  };
};