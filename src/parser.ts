import { decodeLength } from './util//functions';
import { PrematureEOFError, UnexpectedDataError } from './util/errors';
import { Writable } from 'stream';
import { Socket } from 'net';
import T from 'timers/promises';

export class Parser {
    public readonly socket: Socket;
    private ended: boolean;
    constructor(socket: Socket) {
        this.socket = socket;
        this.ended = false;
    }
    readBytes(howMany: number): Promise<Buffer> {
        let tryRead: () => void,
            errorListener: (err: Error) => void,
            endListener: () => void;
        return new Promise<Buffer>((resolve, reject) => {
            tryRead = (): void => {
                if (howMany) {
                    let chunk;
                    if ((chunk = this.socket.read(howMany))) {
                        howMany -= chunk.length;
                        if (howMany === 0) {
                            return resolve(chunk);
                        }
                    }

                    if (this.ended) {
                        return reject(new PrematureEOFError(howMany));
                    }
                } else {
                    return resolve(Buffer.alloc(0));
                }
            };

            this.socket.on('readable', tryRead);
            errorListener = (err: Error): void => {
                return reject(err);
            };
            this.socket.on('error', errorListener);
            endListener = (): void => {
                this.ended = true;
                return reject(new PrematureEOFError(howMany));
            };
            this.socket.on('end', endListener);
            tryRead();
        }).finally(() => {
            this.socket.removeListener('readable', tryRead);
            this.socket.removeListener('error', errorListener);
            return this.socket.removeListener('end', endListener);
        });
    }

    end(): Promise<void> {
        let tryRead: () => void,
            errorListener: (err: Error) => void,
            endListener: () => void;
        return new Promise<void>((resolve, reject) => {
            tryRead = (): void => {
                while (this.socket.read()) {
                    continue;
                }
            };
            this.socket.on('readable', () => {
                tryRead();
            });
            errorListener = (err): void => {
                return reject(err);
            };
            this.socket.on('error', errorListener);
            endListener = (): void => {
                this.ended = true;
                return resolve();
            };
            this.socket.on('end', endListener);
            if (this.ended) {
                return resolve();
            }
            this.socket.read(0);
            this.socket.end();
        }).finally(() => {
            this.socket.removeListener('readable', tryRead);
            this.socket.removeListener('error', errorListener);
            return this.socket.removeListener('end', endListener);
        });
    }

    readAscii(howMany: number): Promise<string> {
        return this.readBytes(howMany).then((chunk) => {
            return chunk.toString('ascii');
        });
    }

    readValue(): Promise<Buffer> {
        return this.readAscii(4).then((value) => {
            const length = decodeLength(value);
            return this.readBytes(length);
        });
    }

    readError(): Promise<Error> {
        return Promise.race([
            T.setTimeout(1000, new Error('Could not read error'), {
                ref: false
            }),
            this.readValue().then((value) => new Error(value.toString()))
        ]);
    }

    unexpected(data: string, expected: string): UnexpectedDataError {
        return new UnexpectedDataError(data, expected);
    }

    readByteFlow(howMany: number, targetStream: Writable): Promise<void> {
        let tryRead: () => void,
            errorListener: (err: Error) => void,
            endListener: () => void;
        return new Promise<void>((resolve, reject) => {
            tryRead = (): void => {
                let chunk: Buffer;
                if (howMany) {
                    while (
                        (chunk =
                            this.socket.read(howMany) || this.socket.read())
                    ) {
                        howMany -= chunk.length;
                        targetStream.write(chunk);
                        if (howMany === 0) {
                            return resolve();
                        }
                    }
                    if (this.ended) {
                        return reject(new PrematureEOFError(howMany));
                    }
                } else {
                    return resolve();
                }
            };
            endListener = (): void => {
                this.ended = true;
                return reject(new PrematureEOFError(howMany));
            };
            errorListener = (err): void => {
                return reject(err);
            };
            this.socket.on('readable', tryRead);
            this.socket.on('error', errorListener);
            this.socket.on('end', endListener);
            tryRead();
        }).finally(() => {
            this.socket.removeListener('readable', tryRead);
            this.socket.removeListener('error', errorListener);
            return this.socket.removeListener('end', endListener);
        });
    }

    private readUntil(code: number): Promise<Buffer> {
        let skipped = Buffer.alloc(0);
        const read = (): Promise<Buffer> => {
            return this.readBytes(1).then((chunk) => {
                if (chunk[0] === code) {
                    return skipped;
                } else {
                    skipped = Buffer.concat([skipped, chunk]);
                    return read();
                }
            });
        };
        return read();
    }

    private readline(): Promise<Buffer> {
        return this.readUntil(0x0a).then((line) => {
            if (line[line.length - 1] === 0x0d) {
                return line.subarray(0, -1);
            }
            return line;
        });
    }

    searchLine(regExp: RegExp, retry = true): Promise<RegExpExecArray> {
        return this.readline().then((line) => {
            const lineStr = line.toString();
            let match;
            if ((match = regExp.exec(lineStr))) {
                return match;
            }
            if (retry) {
                return this.searchLine(regExp);
            }
            throw new UnexpectedDataError(lineStr, regExp.toString());
        });
    }

    readAll(): Promise<Buffer> {
        let tryRead: () => void,
            errorListener: (err: Error) => void,
            endListener: () => void;
        let all = Buffer.alloc(0);
        return new Promise<Buffer>((resolve, reject) => {
            tryRead = (): void => {
                let chunk;
                while ((chunk = this.socket.read())) {
                    all = Buffer.concat([all, chunk]);
                }
                if (this.ended) {
                    return resolve(all);
                }
            };
            this.socket.on('readable', tryRead);
            errorListener = (err): void => {
                return reject(err);
            };
            this.socket.on('error', errorListener);
            endListener = (): void => {
                this.ended = true;
                return resolve(all);
            };
            this.socket.on('end', endListener);
        }).finally(() => {
            this.socket.removeListener('readable', tryRead);
            this.socket.removeListener('error', errorListener);
            return this.socket.removeListener('end', endListener);
        });
    }
}
