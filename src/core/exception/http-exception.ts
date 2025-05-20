export class HttpException extends Error {
    statusCode: number;
    response: any;

    constructor(response: string | Record<string, any>, statusCode: number) {
        super(typeof response === 'string' ? response : JSON.stringify(response));
        this.statusCode = statusCode;
        this.response = response;
        this.name = 'HttpException';
    }
}

export class BadRequestException extends HttpException {
    constructor(response: string | Record<string, any> = 'Bad Request') {
        super(response, 400);
        this.name = 'BadRequestException';
    }
}

export class UnauthorizedException extends HttpException {
    constructor(response: string | Record<string, any> = 'Unauthorized') {
        super(response, 401);
        this.name = 'UnauthorizedException';
    }
}

export class ForbiddenException extends HttpException {
    constructor(response: string | Record<string, any> = 'Forbidden') {
        super(response, 403);
        this.name = 'ForbiddenException';
    }
}

export class NotFoundException extends HttpException {
    constructor(response: string | Record<string, any> = 'Not Found') {
        super(response, 404);
        this.name = 'NotFoundException';
    }
}

export class InternalServerErrorException extends HttpException {
    constructor(response: string | Record<string, any> = 'Internal Server Error') {
        super(response, 500);
        this.name = 'InternalServerErrorException';
    }
}