import { config } from 'dotenv';

// Load environment variables from .env file
config();

export const GET_ENV_VALUES = (key: string) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
}