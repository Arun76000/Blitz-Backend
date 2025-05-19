// Application-wide constants for roles, statuses, and other fixed values
export const ROLES = {
    AGENCY: 'agency' as const,
    AGENT: 'agent' as const,
    ADMIN: 'admin' as const,
};

export const JOB_STATUSES = {
    PENDING: 'pending' as const,
    APPROVED: 'approved' as const,
    COMPLETED: 'completed' as const,
};

export const API_PREFIX = '/api' as const;

export const JWT_EXPIRES_IN = '1d' as const; // JWT token expiration time

export const DEFAULT_PORT = 5000 as const;

export const MONGOOSE_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as const;