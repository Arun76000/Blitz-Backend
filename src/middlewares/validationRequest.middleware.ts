// import { AnyZodObject, ZodError } from 'zod';
// import { Request, Response, NextFunction } from 'express';

// export const validateRequest = (schema: AnyZodObject) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     try {
//       req.body = schema.parse(req.body); // Mutate req.body with parsed/typed data
//       next();
//     } catch (error) {
//       if (error instanceof ZodError) {
//         return res.status(400).json({
//           message: 'Validation error',
//           errors: error.flatten(),
//         });
//       }
//       return res.status(500).json({ message: 'Unexpected error', error });
//     }
//   };
// };


// middleware/validateRequest.ts
import { AnyZodObject, ZodError } from 'zod';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { sendResponse } from '../core/helper/helper.service';


export const formatZodErrors = (error: ZodError) => {
  const formatted: string[] = [];

  for (const [field, messages] of Object.entries(error.flatten().fieldErrors)) {
    formatted.push(`${field} `);

    // if (messages) {
    //   for (const msg of messages) {
    //     formatted.push(`${field} ${msg}`);
    //   }
    // }
  }

  const singleLineError: string = formatted?.length > 1 ? formatted?.join(', ') + "are Required." : formatted?.join(', ') + "is Required.";
  return singleLineError;
};

export const validateRequest = (schema: AnyZodObject, options?: { partial?: boolean }): RequestHandler => {
  const finalSchema = options?.partial ? schema.partial() : schema;
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("----------------------------------------")
      console.log(req.body)
      console.log("----------------------------------------")
      const parsed = finalSchema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      console.log(error)
      if (error instanceof ZodError) {

        const validationErrors = formatZodErrors(error);
        sendResponse(res, 400, "Validation error", { validationErrors })
        return;
      }
      sendResponse(res, 400, "UnExpected Validation error", { error })
    }
  };
};
