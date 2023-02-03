export class UnexpectedDataError extends Error {
    public name = 'UnexpectedDataError';
    public unexpected: string;
    public expected: string;
    constructor(unexpected: string, expected: string) {
        super();
        this.message = `Unexpected '${unexpected}', was expecting ${expected}`;
        this.unexpected = unexpected;
        this.expected = expected;
    }
}
export class PrematureEOFError extends Error {
    public name = 'PrematureEOFError';
    public missingBytes: number;
    constructor(howManyMissing: number) {
        super();
        this.message =
            'Premature end of stream, needed ' + howManyMissing + ' more bytes';
        this.missingBytes = howManyMissing;
    }
}

export class NotConnectedError extends Error {
    public name = 'NotConnectedError';
    public message =
        'Client not connected. `connect` function must be called before use.';
}
export class AdbError extends Error {
    public name = 'AdbError';
    public errno: number;
    public code: string;
    public path: string;
    constructor(message: string, errno: number, code: string, path: string) {
        super();
        this.message = message;
        this.errno = errno;
        this.code = code;
        this.path = path;
    }
}

export class AdbExecError extends Error {
    command: string;
    constructor(message: string, cmd: string) {
        super();
        this.name = 'AdbExecError';
        this.message = message;
        this.command = cmd;
    }
}
