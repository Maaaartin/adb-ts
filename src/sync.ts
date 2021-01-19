import { EventEmitter } from "events";
import { Readable } from "stream";
import fs from 'fs';
import Connection from "./connection";
import { AdbError, FailError, Reply } from ".";
import Parser from "./parser";
import SyncEntry from "./sync/entry";
import Stats from "./sync/stats";
import PushTransfer from "./sync/pushtransfer";
import Promise from 'bluebird';
import Path from 'path';
import PullTransfer from "./sync/pulltransfer";

Promise.config({
    cancellation: true
});

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
        this.parser = connection.getParser();
    }

    public getConnection() {
        return this.connection;
    }

    public static temp(path: string) {
        return `/data/local/tmp/${Path.basename(path)}`;
    }

    private enoent(path: string) {
        const err: AdbError = new Error("ENOENT, no such file or directory '" + path + "'");
        err.errno = 34;
        err.code = 'ENOENT';
        err.path = path;
        return Promise.reject(err);
    }

    private readError() {
        return this.parser.readBytes(4)
            .then((length) => {
                return this.parser.readBytes(length.readUInt32LE(0))
                    .then((buff) => {
                        return Promise.reject(new FailError(buff.toString()));
                    })
            })
    }

    private sendCommandWithLength(cmd: Reply, length: number) {
        const payload = Buffer.alloc(cmd.length + 4);
        payload.write(cmd, 0, cmd.length);
        payload.writeUInt32LE(length, cmd.length);
        return this.connection.write(payload);
    }

    private writeData(stream: Readable, timestamp: number) {
        const transfer = new PushTransfer();
        let connErrorListener: WritableStreamErrorCallback, endListener: VoidFunction, errorListener: WritableStreamErrorCallback, readableListener: VoidFunction
        const writeData = (): Promise<any> => {
            return new Promise((resolve, reject) => {
                stream.on('end', endListener = () => {
                    this.sendCommandWithLength(Reply.DONE, timestamp);
                    return resolve();
                });
                stream.on('readable', readableListener = () => {
                    return writeNext();
                });
                stream.on('error', errorListener = (err: Error) => {
                    return reject(err);
                });
                this.connection.on('error', connErrorListener = (err) => {
                    stream.destroy();
                    this.connection.end();
                    return reject(err);
                });
                const waitForDrain = () => {
                    let drainListener: VoidFunction;
                    return new Promise((resolve) => {
                        this.connection.on('drain', drainListener = () => {
                            return resolve();
                        });
                    })
                        .finally(() => {
                            return this.connection.removeListener('drain', drainListener);
                        });
                };
                const track = () => {
                    return transfer.pop();
                };
                const writeNext = (): Promise<any> => {
                    const chunk = stream.read(SyncMode.DATA_MAX_LENGTH) || stream.read();
                    if (Buffer.isBuffer(chunk)) {
                        this.sendCommandWithLength(Reply.DATA, chunk.length);
                        transfer.push(chunk.length);
                        if (this.connection.write(chunk, track)) {
                            return writeNext();
                        }
                        else {
                            return waitForDrain().then(writeNext);
                        }
                    }
                    else {
                        return Promise.resolve();
                    }
                };
            })
                .finally(() => {
                    stream.removeListener('end', endListener);
                    stream.removeListener('readable', readableListener);
                    stream.removeListener('error', errorListener);
                    return this.connection.removeListener('error', connErrorListener);
                });

        };
        const readReply = () => {
            return this.parser.readAscii(4)
                .then((reply) => {
                    switch (reply) {
                        case Reply.OKAY:
                            return this.parser.readBytes(4).then(() => {
                                return null;
                            });
                        case Reply.FAIL:
                            return this.readError();
                        default:
                            return this.parser.unexpected(reply, 'OKAY or FAIL');
                    }
                })
        };
        const writer: Promise<any> = writeData()
            .catch(Promise.CancellationError, () => {
                return this.connection.end();
            })
            .catch((err) => {
                transfer.emit('error', err);
                return reader.cancel();
            });
        const reader: Promise<any> = readReply()
            .catch(Promise.CancellationError, (err) => {
                this.emit('error', err);
                return writer.cancel();
            })
            .finally(() => {
                return transfer.end();
            });
        transfer.on('cancel', () => {
            writer.cancel();
            reader.cancel();
        });
        return transfer;
    }

    private pushStream(stream: Readable, path: string, mode?: SyncMode | null) {
        if (mode == null) {
            mode = SyncMode.DEFAULT_CHMOD;
        }
        mode |= Stats.S_IFREG;
        this.sendCommandWithArg(Reply.SEND, `${path},${mode}`);
        return this.writeData(stream, Math.floor(Date.now() / 1000));
    }

    private pushFile(file: string, path: string, mode?: SyncMode | null) {
        if (mode === null) {
            mode = SyncMode.DEFAULT_CHMOD;
        }
        mode = mode || SyncMode.DEFAULT_CHMOD;
        return this.pushStream(fs.createReadStream(file), path, mode);
    }

    public push(contents: string | Readable, path: string, mode: SyncMode = null) {
        if (typeof contents === 'string') {
            return this.pushFile(contents, path, mode);
        } else {
            return this.pushStream(contents, path, mode);
        }
    }

    private readData() {
        let cancelListener: VoidFunction;
        const transfer = new PullTransfer();
        const readNext = (): Promise<any> => {
            return this.parser.readAscii(4)
                .then((reply) => {
                    switch (reply) {
                        case Reply.DATA:
                            return this.parser.readBytes(4).then((lengthData) => {
                                const length = lengthData.readUInt32LE(0);
                                return this.parser.readByteFlow(length, transfer).then(readNext);
                            });
                        case Reply.DONE:
                            return this.parser.readBytes(4).return();
                        case Reply.FAIL:
                            return this.readError();
                        default:
                            return this.parser.unexpected(reply, 'DATA, DONE or FAIL');
                    }
                })
        };
        const reader = readNext()
            .catch(Promise.CancellationError, (err) => {
                this.connection.end();
            })
            .catch((err) => {
                transfer.emit('error', err);
            })
            .finally(() => {
                transfer.removeListener('cancel', cancelListener);
                return transfer.end();
            });
        transfer.on('cancel', cancelListener = () => {
            reader.cancel();
        });
        return transfer;
    }

    public pull(path: string) {
        this.sendCommandWithArg(Reply.RECV, path);
        return this.readData();
    }

    public readDir(path: string) {
        const files: SyncEntry[] = [];
        const readNext = (): Promise<SyncEntry[]> => {
            return this.parser.readAscii(4)
                .then((reply) => {
                    switch (reply) {
                        case Reply.DENT:
                            return this.parser.readBytes(16)
                                .then((stat) => {
                                    const mode = stat.readUInt32LE(0);
                                    const size = stat.readUInt32LE(4);
                                    const mtime = stat.readUInt32LE(8);
                                    const nameLen = stat.readUInt32LE(12);
                                    return this.parser.readBytes(nameLen)
                                        .then((name) => {
                                            const nameStr = name.toString();
                                            if (!(nameStr === '.' || nameStr === '..')) {
                                                files.push(new SyncEntry(nameStr, mode, size, mtime));
                                            }
                                            return readNext();
                                        })
                                })
                        case Reply.DONE:
                            return this.parser.readBytes(16)
                                .then(() => {
                                    return files;
                                })
                        case Reply.FAIL:
                            return this.parser.readError();
                        default:
                            return this.parser.unexpected(reply, 'DENT, DONE or FAIL');
                    }
                })
        }
        this.sendCommandWithArg(Reply.LIST, path);
        return readNext();
    }

    public end() {
        this.connection.end();
        return this;
    }
    public stat(path: string, cb?: Function) {
        this.sendCommandWithArg(Reply.STAT, path);
        return this.parser.readAscii(4)
            .then((reply) => {
                switch (reply) {
                    case Reply.STAT:
                        return this.parser.readBytes(12)
                            .then((stat) => {
                                const mode = stat.readUInt32LE(0);
                                const size = stat.readUInt32LE(4);
                                const mtime = stat.readUInt32LE(8);
                                if (mode === 0) {
                                    return this.enoent(path);
                                }
                                else {
                                    return new Stats(mode, size, mtime);
                                }
                            })
                    case Reply.FAIL:
                        return this.readError();
                    default:
                        return this.parser.unexpected(reply, 'STAT or FAIL');
                }
            })
    }

    private sendCommandWithArg(cmd: string, arg: string) {
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