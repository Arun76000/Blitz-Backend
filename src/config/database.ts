import mongoose from 'mongoose';
import { GET_ENV_VALUES } from './env';
import { MONGOOSE_OPTIONS } from './constants';
import { logger } from '../utils/logger';

export const connectDB = async (): Promise<void> => {
    try {
        const MONGO_URI = GET_ENV_VALUES('MONGO_URI') ?? 'mongodb://localhost:27017/blitz';
        await mongoose.connect(MONGO_URI);
        logger.info('MongoDB connected successfully');
    } catch (error) {
        logger.error(`MongoDB connection error: ${error}`);
        process.exit(1);
    }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
    logger.info('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
    logger.info('MongoDB connection disconnected');
});