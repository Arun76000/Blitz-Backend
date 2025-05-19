import { config } from 'dotenv';

// Load environment variables from .env file
config();

interface EnvConfig {
    MONGO_URI: string;
    JWT_SECRET: string;
    PORT: number;
    NODE_ENV: string;
}

export const getEnv = (): EnvConfig => {
    const env = {
        MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/blitz',
        JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
        PORT: parseInt(process.env.PORT || '5000', 10),
        NODE_ENV: process.env.NODE_ENV || 'development',
    };

    // Validate required environment variables
    if (!env.MONGO_URI) {
        throw new Error('MONGO_URI is required');
    }
    if (!env.JWT_SECRET) {
        throw new Error('JWT_SECRET is required');
    }

    return env;
};

export const GET_ENV_VALUES = (key: string) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
}