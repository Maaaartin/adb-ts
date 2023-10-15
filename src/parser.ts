import { decodeLength } from './util//functions';
import { PrematureEOFError, UnexpectedDataError } from './util';
import { Writable } from 'stream';
import { Socket } from 'net';
import T from 'timers/promises';
import EventUnregister from './util/eventUnregister';

export class Parser {
    public readonly socket: Socket;
    private ended = false;
    constructor(socket: Socket) {
        this.socket = socket;
    }
    public readBytes(howMany: number): Promise<Buffer> {
        const eventUnregister = new EventUnregister(this.socket);
        const promise = new Promise<Buffer>((resolve, reject) => {
            const tryRead = (): void => {
                if (!howMany) {
                    return resolve(Buffer.alloc(0));
                }

                const chunk = this.socket.read(howMany);
                if (chunk) {
                    howMany -= chunk.length;
                    if (howMany === 0) {
                        return resolve(chunk);
                    }
                }

                if (this.ended) {
                    return reject(new PrematureEOFError(howMany));
                }
            };

            eventUnregister.register((socket) =>
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
        return eventUnregister.unregisterAfter(promise);
    }

    public end(): Promise<void> {
        const eventUnregister = new EventUnregister(this.socket);
        const promise = new Promise<void>((resolve, reject) => {
            eventUnregister.register((socket) =>
                socket
                    .on('readable', (): void => {
                        while (this.socket.read()) {
                            continue;
                        }
                    })
                    .on('error', reject)
                    .on('end', (): void => {
                        this.ended = true;
                        resolve();
                    })
            );
            if (this.ended) {
                return resolve();
            }

            this.socket.read(0);
            this.socket.end();
        });
        return eventUnregister.unregisterAfter(promise);
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
        const eventUnregister = new EventUnregister(this.socket);
        const promise = new Promise<void>((resolve, reject) => {
            const tryRead = (): void => {
                if (!howMany) {
                    return resolve();
                }

                const readAll = (
                    chunk = this.socket.read(howMany) || this.socket.read()
                ): boolean => {
                    if (!chunk) {
                        return false;
                    }
                    howMany -= chunk.length;
                    targetStream.write(chunk);
                    return howMany === 0 || readAll();
                };
                if (readAll()) {
                    return resolve();
                }
                if (this.ended) {
                    return reject(new PrematureEOFError(howMany));
                }
            };
            eventUnregister.register((socket) =>
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
        return eventUnregister.unregisterAfter(promise);
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
        const match = regExp.exec(line);
        if (match) {
            return match;
        }
        if (retry) {
            return this.searchLine(regExp);
        }
        throw new UnexpectedDataError(line, regExp.toString());
    }

    public readAll(): Promise<Buffer> {
        const eventUnregister = new EventUnregister(this.socket);
        const promise = new Promise<Buffer>((resolve, reject) => {
            let all = Buffer.alloc(0);
            const tryRead = (): void => {
                const read = (acc: Buffer): Buffer => {
                    const chunk = this.socket.read();
                    if (chunk) {
                        return read(Buffer.concat([acc, chunk]));
                    }
                    return acc;
                };
                all = read(all);

                if (this.ended) {
                    return resolve(all);
                }
            };
            eventUnregister.register((socket) =>
                socket
                    .on('readable', tryRead)
                    .on('error', reject)
                    .on('end', (): void => {
                        this.ended = true;
                        return resolve(all);
                    })
            );
        });
        return eventUnregister.unregisterAfter(promise);
    }
}
