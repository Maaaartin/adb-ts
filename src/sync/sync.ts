import { Reply } from '../util';
import { Connection } from '../connection';
import { EventEmitter } from 'events';
import { Parser } from '../parser';
import Path from 'path';
import { PullTransfer } from './pulltransfer';
import { PushTransfer } from './pushtransfer';
import { Readable } from 'stream';
import Stats from './stats';
import SyncEntry from './entry';
import fs from 'fs';
import { promisify } from 'util';

export enum SyncMode {
    DEFAULT_CHMOD = 0x1a4,
    DATA_MAX_LENGTH = 65536
}

export class Sync extends EventEmitter {
    private readonly connection: Connection;
    private readonly parser: Parser;

    constructor(connection: Connection) {
        super();
        this.connection = connection;
        this.parser = connection.parser;
    }

    public static temp(path: string): string {
        return `/data/local/tmp/${Path.basename(path)}`;
    }

    private readError(): Promise<never> {
        return this.parser.readBytes(4).then((length) => {
            return this.parser
                .readBytes(length.readUInt32LE(0))
                .then((buff) => {
                    throw new Error(buff.toString());
                });
        });
    }

    private sendCommandWithLength(cmd: Reply, length: number): boolean {
        const payload = Buffer.alloc(cmd.length + 4);
        payload.write(cmd, 0, cmd.length);
        payload.writeUInt32LE(length, cmd.length);
        return this.connection.write(payload);
    }

    private writeData(stream: Readable, timestamp: number): PushTransfer {
        const transfer = new PushTransfer();

        let connErrorListener: (error?: Error | null) => void,
            endListener: () => void,
            errorListener: (error?: Error | null) => void,
            readableListener: () => void,
            canceled = false;
        const writeData = (): Promise<any> => {
            return new Promise<void>((resolve, reject) => {
                const writeNext = (): Promise<any> => {
                    const chunk =
                        stream.read(SyncMode.DATA_MAX_LENGTH) || stream.read();
                    if (Buffer.isBuffer(chunk)) {
                        this.sendCommandWithLength(Reply.DATA, chunk.length);
                        transfer.push(chunk.length);
                        if (
                            this.connection.write(chunk, (err) => {
                                if (err) {
                                    throw err;
                                } else {
                                    transfer.pop();
                                }
                            })
                        ) {
                            return writeNext();
                        } else {
                            return waitForDrain().then(writeNext);
                        }
                    } else {
                        return Promise.resolve();
                    }
                };
                stream.once(
                    'end',
                    (endListener = (): void => {
                        this.sendCommandWithLength(Reply.DONE, timestamp);
                        return resolve();
                    })
                );
                stream.on(
                    'readable',
                    (readableListener = (): Promise<any> => writeNext())
                );
                stream.once(
                    'error',
                    (errorListener = (err): void => reject(err))
                );
                this.connection.once(
                    'error',
                    (connErrorListener = (err): void => {
                        stream.destroy();
                        this.connection.end();
                        return reject(err);
                    })
                );
                const waitForDrain = (): Promise<void> => {
                    return new Promise<void>((resolve) => {
                        this.connection.removeAllListeners('drain');
                        this.connection.once('drain', (): void => {
                            resolve();
                        });
                    });
                };
            }).finally(() => {
                stream.removeListener('end', endListener);
                stream.removeListener('readable', readableListener);
                stream.removeListener('error', errorListener);
                return this.connection.removeListener(
                    'error',
                    connErrorListener
                );
            });
        };
        const readReply = (): Promise<void> => {
            return this.parser.readAscii(4).then((reply) => {
                switch (reply) {
                    case Reply.OKAY:
                        return this.parser.readBytes(4).then(() => {
                            return undefined;
                        });
                    case Reply.FAIL:
                        return this.readError();
                    default:
                        throw this.parser.unexpected(reply, 'OKAY or FAIL');
                }
            });
        };
        writeData()
            .then(readReply)
            .catch((err) => {
                if (canceled) {
                    return promisify<void>((cb) =>
                        this.connection.end(() => cb(null))
                    )();
                }
                transfer.emit('error', err);
                return;
            })
            .finally(() => {
                return transfer.end();
            });

        transfer.once('cancel', () => {
            canceled = true;
        });
        return transfer;
    }

    private pushStream(
        stream: Readable,
        path: string,
        mode?: SyncMode | null
    ): PushTransfer {
        if (mode == null) {
            mode = SyncMode.DEFAULT_CHMOD;
        }
        mode |= Stats.S_IFREG;
        this.sendCommandWithArg(Reply.SEND, `${path},${mode}`);
        return this.writeData(stream, Math.floor(Date.now() / 1000));
    }

    private pushFile(
        file: string,
        path: string,
        mode?: SyncMode | null
    ): PushTransfer {
        if (mode === null) {
            mode = SyncMode.DEFAULT_CHMOD;
        }
        mode = mode || SyncMode.DEFAULT_CHMOD;
        return this.pushStream(fs.createReadStream(file), path, mode);
    }

    public push(
        contents: string | Readable,
        path: string,
        mode: SyncMode | null = null
    ): PushTransfer {
        if (typeof contents === 'string') {
            return this.pushFile(contents, path, mode);
        } else {
            return this.pushStream(contents, path, mode);
        }
    }

    private readData(): PullTransfer {
        let canceled = false;
        const transfer = new PullTransfer();
        const readNext = (): Promise<any> => {
            return this.parser.readAscii(4).then((reply) => {
                switch (reply) {
                    case Reply.DATA:
                        return this.parser.readBytes(4).then((lengthData) => {
                            const length = lengthData.readUInt32LE(0);
                            return this.parser
                                .readByteFlow(length, transfer)
                                .then(readNext);
                        });
                    case Reply.DONE:
                        return this.parser.readBytes(4).then(() => {});

                    case Reply.FAIL:
                        return this.readError();
                    default:
                        throw this.parser.unexpected(
                            reply,
                            'DATA, DONE or FAIL'
                        );
                }
            });
        };
        readNext()
            .catch((err) => {
                if (canceled) {
                    return promisify<void>((cb) =>
                        this.connection.end(() => cb(null))
                    )();
                }
                transfer.emit('error', err);
                return;
            })
            .finally(() => {
                return promisify((cb) => transfer.end(cb))();
            });
        transfer.once('cancel', () => (canceled = true));
        return transfer;
    }

    public pull(path: string): PullTransfer {
        this.sendCommandWithArg(Reply.RECV, path);
        return this.readData();
    }

    public readDir(path: string): Promise<SyncEntry[]> {
        const files: SyncEntry[] = [];
        const readNext = (): Promise<SyncEntry[]> => {
            return this.parser.readAscii(4).then((reply) => {
                switch (reply) {
                    case Reply.DENT:
                        return this.parser.readBytes(16).then((stat) => {
                            const mode = stat.readUInt32LE(0);
                            const size = stat.readUInt32LE(4);
                            const mtime = stat.readUInt32LE(8);
                            const nameLen = stat.readUInt32LE(12);
                            return this.parser
                                .readBytes(nameLen)
                                .then((name) => {
                                    const nameStr = name.toString();
                                    if (
                                        !(nameStr === '.' || nameStr === '..')
                                    ) {
                                        files.push(
                                            new SyncEntry(
                                                nameStr,
                                                mode,
                                                size,
                                                mtime
                                            )
                                        );
                                    }
                                    return readNext();
                                });
                        });
                    case Reply.DONE:
                        return this.parser.readBytes(16).then(() => {
                            return files;
                        });
                    case Reply.FAIL:
                        return this.parser.readError().then((e) => {
                            throw e;
                        });

                    default:
                        throw this.parser.unexpected(
                            reply,
                            'DENT, DONE or FAIL'
                        );
                }
            });
        };
        this.sendCommandWithArg(Reply.LIST, path);
        return readNext();
    }

    public end(): void {
        this.connection.end();
    }

    private sendCommandWithArg(cmd: string, arg: string): boolean {
        const arglen = Buffer.byteLength(arg, 'utf-8');
        const payload = Buffer.alloc(cmd.length + 4 + arglen);
        let pos = 0;
        payload.write(cmd, pos, cmd.length);
        pos += cmd.length;
        payload.writeUInt32LE(arglen, pos);
        pos += 4;
        payload.write(arg, pos);
        return this.connection.write(payload);
    }
}
