export const HttpCodes = {
    // Standard HTTP Status Codes
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,

    // Custom Application-Specific Codes
    USER_ALREADY_EXISTS: 1001,
    INVALID_USER_ROLE: 1002,
    MISSING_AGENCY_FIELDS: 1003,
    MISSING_AGENT_FIELDS: 1004,
    INVALID_ZIPCODE: 1005,
    JOB_NOT_FOUND: 1006,
    AGENT_NOT_FOUND: 1007,
    AGENCY_NOT_FOUND: 1008,
    INVALID_JOB_APPLICATION: 1009,
    PASSWORD_TOO_SHORT: 1010,
    INVALID_LICENSE: 1011,
    SKILLS_LIMIT_EXCEEDED: 1012,
} as const;

export type HttpCode = typeof HttpCodes[keyof typeof HttpCodes];

// Optional: Helper function to get error messages for custom codes
export const getHttpCodeMessage = (code: HttpCode): string => {
    switch (code) {
        // Standard HTTP codes
        case HttpCodes.OK: return 'Success';
        case HttpCodes.ACCEPTED: return 'accepted';
        case HttpCodes.CREATED: return 'Resource created successfully';
        case HttpCodes.NO_CONTENT: return 'No content';
        case HttpCodes.BAD_REQUEST: return 'Bad request';
        case HttpCodes.UNAUTHORIZED: return 'Unauthorized';
        case HttpCodes.FORBIDDEN: return 'Forbidden';
        case HttpCodes.NOT_FOUND: return 'Resource not found';
        case HttpCodes.CONFLICT: return 'Conflict';
        case HttpCodes.UNPROCESSABLE_ENTITY: return 'Unprocessable entity';
        case HttpCodes.INTERNAL_SERVER_ERROR: return 'Internal server error';
        case HttpCodes.SERVICE_UNAVAILABLE: return 'Service unavailable';

        // Custom codes
        case HttpCodes.USER_ALREADY_EXISTS: return 'User with this email already exists';
        case HttpCodes.INVALID_USER_ROLE: return 'Invalid user role specified';
        case HttpCodes.MISSING_AGENCY_FIELDS: return 'Required agency fields are missing';
        case HttpCodes.MISSING_AGENT_FIELDS: return 'Required agent fields are missing';
        case HttpCodes.INVALID_ZIPCODE: return 'Invalid zipcode format';
        case HttpCodes.JOB_NOT_FOUND: return 'Job not found';
        case HttpCodes.AGENT_NOT_FOUND: return 'Agent not found';
        case HttpCodes.AGENCY_NOT_FOUND: return 'Agency not found';
        case HttpCodes.INVALID_JOB_APPLICATION: return 'Invalid job application';
        case HttpCodes.PASSWORD_TOO_SHORT: return 'Password must be at least 8 characters';
        case HttpCodes.INVALID_LICENSE: return 'Invalid license details';
        case HttpCodes.SKILLS_LIMIT_EXCEEDED: return 'Skills list exceeds maximum allowed (10)';

        default: return 'Unknown error';
    }
};