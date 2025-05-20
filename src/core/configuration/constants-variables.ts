// constants.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { GET_ENV_VALUES } from '../../config';
dotenv.config();

export const constants = Object.freeze({
  DEFAULT_TEST_OTP: '1234',
  DOCUMENT_CONFLICT_CODE: 11000,
  ENVIRONMENT: Object.freeze({
    LOCAL: 'local',
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
  }),
  // All Roles go Here
  ROLES: Object.freeze({
    admin: 1,
    agency: 2,
    agent: 3,
  }),
  // All Genders go Here
  GENDER: Object.freeze({
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other',
    NOT_KNOWN: 'notKnown',
  }),
  DEVICE_TYPE: Object.freeze({
    ANDROID: 'android',
    ISO: 'iso',
  }),
  // All Collection Names go Here
  COLLECTIONS: Object.freeze({
    USERS: 'users',
    SETTINGS: 'settings',
    SMS_TEMPLATES: 'sms_templates',
    EMAIL_TEMPLATES: 'email_templates',
    SERVICES: 'services',
    COUNTRY: 'country',
    STATES: 'states',
    CITIES: 'cities',
    DOCUMENTS: 'documents',
    CHATS: 'chats'
  }),
  SEETING_GROUPNAME: Object.freeze({
    GENERAL: 'general',
    SMTP: 'smtp',
    STRIPE: 'stripe',
    TWILLIO: 'twilio',
  }),
  // All Allowed File Formats go Here
  ALLOWED_FILE_FORMATS: Object.freeze({
    JPEG: 'image/jpeg',
    JPG: 'image/jpg',
    PNG: 'image/png',
    MP4: 'video/mp4',
    WEBM: 'video/webm',
    PDF: 'application/pdf',
  }),
});

// JWT utilities to replace NestJS JWT Module
export const jwtUtils = {
  sign: (payload: string, options = {}) => {
    return jwt.sign(payload, GET_ENV_VALUES('JWT_SECRET'), options);
  },
  verify: (token: string) => {
    return jwt.verify(token, GET_ENV_VALUES('JWT_SECRET'));
  },
  decode: (token: string) => {
    return jwt.decode(token);
  }
};

export default { constants, jwtUtils };