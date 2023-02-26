import { decodeLength } from './util//functions';
import { PrematureEOFError, UnexpectedDataError } from './util';
import { Writable } from 'stream';
import { Socket } from 'net';
import T from 'timers/promises';
import EventDeregister from './util/eventDeregister';

export class Parser {
    public readonly socket: Socket;
    private ended = false;
    constructor(socket: Socket) {
        this.socket = socket;
    }
    public async readBytes(howMany: number): Promise<Buffer> {
        const eventDeregister = new EventDeregister(this.socket);
        try {
            return await new Promise<Buffer>((resolve, reject) => {
                const tryRead = (): void => {
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

                eventDeregister.register((socket) =>
                    socket
                        .on('readable', tryRead)
                        .on('error', reject)
                        .on('end', (): void => {
                            this.ended = true;
                            reject(new PrematureEOFError(howMany));
                        })
                );

                tryRead();
            });
        } finally {
            eventDeregister.unregister();
        }
    }

    public end(): Promise<void> {
        let tryRead: () => void,
            errorListener: (err: Error) => void,
            endListener: () => void;
        return new Promise<void>((resolve, reject) => {
            tryRead = (): void => {
                while (this.socket.read()) {
                    continue;
                }
            };
            this.socket.on('readable', tryRead);
            this.socket.on('error', (errorListener = reject));
            this.socket.on(
                'end',
                (endListener = (): void => {
                    this.ended = true;
                    resolve();
                })
            );
            if (this.ended) {
                return resolve();
            }
            this.socket.read(0);
            this.socket.end();
        }).finally(() => {
            this.socket.removeListener('readable', tryRead);
            this.socket.removeListener('error', errorListener);
            this.socket.removeListener('end', endListener);
        });
    }

    public async readAscii(howMany: number): Promise<string> {
        return (await this.readBytes(howMany)).toString('ascii');
    }

    public async readValue(): Promise<Buffer> {
        const value = await this.readAscii(4);
        const length = decodeLength(value);
        return this.readBytes(length);
    }

    public readError(): Promise<Error> {
        return Promise.race([
            T.setTimeout(1000, new Error('Could not read error'), {
                ref: false
            }),
            this.readValue().then((value) => new Error(value.toString()))
        ]);
    }

    public unexpected(data: string, expected: string): UnexpectedDataError {
        return new UnexpectedDataError(data, expected);
    }

    public readByteFlow(
        howMany: number,
        targetStream: Writable
    ): Promise<void> {
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
                }
                return resolve();
            };
            this.socket.on('readable', tryRead);
            this.socket.on('error', (errorListener = reject));
            this.socket.on(
                'end',
                (endListener = (): void => {
                    this.ended = true;
                    reject(new PrematureEOFError(howMany));
                })
            );
            tryRead();
        }).finally(() => {
            this.socket.removeListener('readable', tryRead);
            this.socket.removeListener('error', errorListener);
            this.socket.removeListener('end', endListener);
        });
    }

    private readUntil(code: number): Promise<Buffer> {
        const read = async (skipped = Buffer.alloc(0)): Promise<Buffer> => {
            const chunk = await this.readBytes(1);
            if (chunk[0] === code) {
                return skipped;
            }
            return read(Buffer.concat([skipped, chunk]));
        };
        return read();
    }

    private async readline(): Promise<Buffer> {
        const line = await this.readUntil(10);
        if (line[line.length - 1] === 13) {
            return line.subarray(0, -1);
        }
        return line;
    }

    public async searchLine(
        regExp: RegExp,
        retry = true
    ): Promise<RegExpExecArray> {
        const line = (await this.readline()).toString();
        let match;
        if ((match = regExp.exec(line))) {
            return match;
        }
        if (retry) {
            return this.searchLine(regExp);
        }
        throw new UnexpectedDataError(line, regExp.toString());
    }

    public readAll(): Promise<Buffer> {
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
            errorListener = reject;
            this.socket.on('error', errorListener);
            this.socket.on(
                'end',
                (endListener = (): void => {
                    this.ended = true;
                    return resolve(all);
                })
            );
        }).finally(() => {
            this.socket.removeListener('readable', tryRead);
            this.socket.removeListener('error', errorListener);
            this.socket.removeListener('end', endListener);
        });
    }
}
