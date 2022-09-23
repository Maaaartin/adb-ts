import { AdbError, FailError, Reply } from '.';
import Connection from './connection';
import { EventEmitter } from 'events';
import Parser from './parser';
import Path from 'path';
import PullTransfer from './sync/pulltransfer';
import PushTransfer from './sync/pushtransfer';
import { Readable } from 'stream';
import Stats from './sync/stats';
import SyncEntry from './sync/entry';
import fs from 'fs';
import { promisify } from 'util';

export enum SyncMode {
    DEFAULT_CHMOD = 0x1a4,
    DATA_MAX_LENGTH = 65536
}

export default class Sync extends EventEmitter {
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

    private enoent(path: string): Promise<never> {
        const err = new AdbError(
            "ENOENT, no such file or directory '" + path + "'",
            34,
            'ENOENT',
            path
        );

        return Promise.reject(err);
    }

    private readError(): Promise<never> {
        return this.parser.readBytes(4).then((length) => {
            return this.parser
                .readBytes(length.readUInt32LE(0))
                .then((buff) => {
                    throw new FailError(buff.toString());
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
                stream.on('readable', (readableListener = writeNext));
                stream.once('error', (errorListener = reject));
                this.connection.on(
                    'error',
                    (connErrorListener = (err): void => {
                        stream.destroy();
                        this.connection.end();
                        return reject(err);
                    })
                );
                const waitForDrain = (): Promise<void> => {
                    let drainListener: () => void;
                    return new Promise<void>((resolve) => {
                        this.connection.on(
                            'drain',
                            (drainListener = (): void => {
                                resolve();
                            })
                        );
                    }).finally(() => {
                        return this.connection.removeListener(
                            'drain',
                            drainListener
                        );
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
                            return void 0;
                        });
                    case Reply.FAIL:
                        return this.readError();
                    default:
                        throw this.parser.unexpected(reply, 'OKAY or FAIL');
                }
            });
        };
        writeData().catch((err) => {
            if (canceled) {
                return promisify(this.connection.end)();
            } else {
                transfer.emit('error', err);
                return Promise.resolve();
            }
        });
        readReply()
            .catch((err) => {
                if (canceled) {
                    this.emit('error', err);
                }
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
                    return promisify(this.connection.end)();
                } else {
                    transfer.emit('error', err);
                    return Promise.resolve();
                }
            })
            .finally(() => promisify(transfer.end)());
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

    public end(): Promise<this> {
        return this.connection.endAsync().then(() => this);
    }
    public stat(path: string): Promise<Stats> {
        this.sendCommandWithArg(Reply.STAT, path);
        return this.parser.readAscii(4).then((reply) => {
            switch (reply) {
                case Reply.STAT:
                    return this.parser.readBytes(12).then((stat) => {
                        const mode = stat.readUInt32LE(0);
                        const size = stat.readUInt32LE(4);
                        const mtime = stat.readUInt32LE(8);
                        if (mode === 0) {
                            return this.enoent(path);
                        } else {
                            return new Stats(mode, size, mtime);
                        }
                    });
                case Reply.FAIL:
                    return this.parser.readError().then((e) => {
                        throw e;
                    });

                default:
                    throw this.parser.unexpected(reply, 'STAT or FAIL');
            }
        });
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
