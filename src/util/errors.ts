export class FailError extends Error {
    constructor(message?: string) {
        super();
        Object.setPrototypeOf(this, FailError.prototype);
        this.name = 'FailError';
        this.message = `Failure: ${message}`;
        Error.captureStackTrace(this);
    }
}

export class UnexpectedDataError extends Error {
    public unexpected: string;
    public expected: string;
    constructor(unexpected: string, expected: string) {
        super();
        Object.setPrototypeOf(this, UnexpectedDataError.prototype);
        this.name = 'UnexpectedDataError';
        this.message = `Unexpected '${unexpected}', was expecting ${expected}`;
        this.unexpected = unexpected;
        this.expected = expected;
        Error.captureStackTrace(this);
    }
}
export class PrematureEOFError extends Error {
    public missingBytes: number;
    constructor(howManyMissing: number) {
        super();
        Object.setPrototypeOf(this, PrematureEOFError.prototype);
        this.name = 'PrematureEOFError';
        this.message =
            'Premature end of stream, needed ' + howManyMissing + ' more bytes';
        this.missingBytes = howManyMissing;
        Error.captureStackTrace(this);
    }
}

export class NotConnectedError extends Error {
    constructor() {
        super();
        Object.setPrototypeOf(this, NotConnectedError.prototype);
        this.name = 'NotConnectedError';
        this.message =
            'Client not connected. `connect` function must be called before use.';
        Error.captureStackTrace(this);
    }
}
export class AdbError extends Error {
    errno: number;
    code: string;
    path: string;
    constructor(message: string, errno: number, code: string, path: string) {
        super();
        Object.setPrototypeOf(this, AdbError.prototype);
        this.name = 'AdbError';
        this.message = message;
        this.errno = errno;
        this.code = code;
        this.path = path;
        Error.captureStackTrace(this);
    }
}

export class AdbExecError extends Error {
    command: string;
    constructor(message: string, cmd: string) {
        super();
        Object.setPrototypeOf(this, AdbExecError.prototype);
        this.name = 'AdbExecError';
        this.message = message;
        this.command = cmd;
        Error.captureStackTrace(this);
    }
}