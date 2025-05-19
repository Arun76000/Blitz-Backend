import { File } from 'multer';

declare module 'multer' {
  interface FileFilterCallback {
    (error: Error | null, acceptFile: boolean): void;
  }
}