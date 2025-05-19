import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { catchAsync, generateRandomString } from '../core/helper/helper.service.js';


// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadPath = path.join(__dirname, '..', '..', 'public', 'uploads');
    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${generateRandomString(6)}`;
    cb(null, `${uniqueSuffix}${extension}`);
  },
});

// File filter to allow only specific file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'video/mp4',
    'video/mpeg',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed types: JPEG, PNG, GIF, PDF, MP4, MPEG'), false);
  }
};

// Configure multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Middleware for single file upload
export const uploadSingle = (fieldName: string) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const singleUpload = upload.single(fieldName);
    await new Promise<void>((resolve, reject) => {
      singleUpload(req, res, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    next();
  });

// Middleware for multiple file uploads
export const uploadMultiple = (fields: { name: string; maxCount?: number }[]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const multipleUpload = upload.fields(fields);
    await new Promise<void>((resolve, reject) => {
      multipleUpload(req, res, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    next();
  });