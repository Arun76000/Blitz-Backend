export const logger = {
    info: (message: string) => console.log(`[INFO] ${message}`),
    warn: (message: string) => console.log(`[Warning ${message}]`),
    error: (message: string) => console.error(`[ERROR] ${message}`),
};