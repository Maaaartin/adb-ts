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
import EventUnregister from '../util/eventDeregister';

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

    private async error(): Promise<never> {
        const length = await this.parser.readBytes(4);
        const buff = await this.parser.readBytes(length.readUInt32LE(0));
        throw new Error(buff.toString());
    }

    private sendCommandWithLength(cmd: Reply, length: number): boolean {
        const payload = Buffer.alloc(cmd.length + 4);
        payload.write(cmd, 0, cmd.length);
        payload.writeUInt32LE(length, cmd.length);
        return this.connection.write(payload);
    }

    private writeData(stream: Readable, timestamp: number): PushTransfer {
        const transfer = new PushTransfer();

        let canceled = false;
        const writeData = async (): Promise<void> => {
            const streamUnregister = new EventUnregister(stream);
            const connectionUnregister = new EventUnregister(this.connection);

            const promise = new Promise<void>((resolve, reject) => {
                const writeNext = async (): Promise<void> => {
                    const chunk =
                        stream.read(SyncMode.DATA_MAX_LENGTH) || stream.read();
                    if (Buffer.isBuffer(chunk)) {
                        this.sendCommandWithLength(Reply.DATA, chunk.length);
                        transfer.push(chunk.length);
                        if (
                            this.connection.write(chunk, (err) => {
                                if (err) {
                                    return reject(err);
                                }
                                transfer.pop();
                            })
                        ) {
                            return writeNext();
                        }
                        await waitForDrain();
                        return writeNext();
                    }
                };
                streamUnregister.register((stream_) =>
                    stream_
                        .on('end', (): void => {
                            this.sendCommandWithLength(Reply.DONE, timestamp);
                            resolve();
                        })
                        .on('readable', writeNext)
                        .on('error', reject)
                );
                connectionUnregister.register((connection) =>
                    connection.on('error', (err): void => {
                        stream.destroy();
                        this.connection.end();
                        reject(err);
                    })
                );

                const waitForDrain = promisify<void>((cb) =>
                    this.connection.once('drain', cb)
                );
            });
            await Promise.all([
                streamUnregister.unregisterAfter(promise),
                connectionUnregister.unregisterAfter(promise)
            ]);
        };
        const readReply = async (): Promise<void> => {
            const reply = await this.parser.readAscii(4);
            switch (reply) {
                case Reply.OKAY:
                    await this.parser.readBytes(4);
                    return;
                case Reply.FAIL:
                    throw await this.error();
                default:
                    throw this.parser.unexpected(reply, 'OKAY or FAIL');
            }
        };

        (async (): Promise<void> => {
            try {
                await writeData();
                await readReply();
            } catch (err) {
                if (canceled) {
                    this.connection.end();
                    return;
                }
                transfer.emit('error', err);
            } finally {
                transfer.end();
            }
        })();

        transfer.once('cancel', () => (canceled = true));
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
        }
        return this.pushStream(contents, path, mode);
    }

    private readData(): PullTransfer {
        let canceled = false;
        const transfer = new PullTransfer();
        const readNext = async (): Promise<void> => {
            const reply = await this.parser.readAscii(4);
            switch (reply) {
                case Reply.DATA: {
                    const length = (
                        await this.parser.readBytes(4)
                    ).readUInt32LE(0);
                    await this.parser.readByteFlow(length, transfer);
                    return readNext();
                }
                case Reply.DONE:
                    await this.parser.readBytes(4);
                    return;

                case Reply.FAIL:
                    return this.error();
                default:
                    throw this.parser.unexpected(reply, 'DATA, DONE or FAIL');
            }
        };
        (async (): Promise<void> => {
            try {
                await readNext();
            } catch (err) {
                if (canceled) {
                    this.connection.end();
                    return;
                }
                transfer.emit('error', err);
            } finally {
                transfer.end();
            }
        })();

        transfer.once('cancel', () => (canceled = true));
        return transfer;
    }

    public pull(path: string): PullTransfer {
        this.sendCommandWithArg(Reply.RECV, path);
        return this.readData();
    }

    public async readDir(path: string): Promise<SyncEntry[]> {
        const files: SyncEntry[] = [];
        const readNext = async (): Promise<SyncEntry[]> => {
            const reply = await this.parser.readAscii(4);
            switch (reply) {
                case Reply.DENT: {
                    const stat = await this.parser.readBytes(16);
                    const [mode, size, mtime, nameLen] = [
                        stat.readUInt32LE(0),
                        stat.readUInt32LE(4),
                        stat.readUInt32LE(8),
                        stat.readUInt32LE(12)
                    ];
                    const name = (
                        await this.parser.readBytes(nameLen)
                    ).toString();
                    if (!(name === '.' || name === '..')) {
                        files.push(new SyncEntry(name, mode, size, mtime));
                    }
                    return readNext();
                }
                case Reply.DONE:
                    await this.parser.readBytes(16);
                    return files;

                case Reply.FAIL:
                    throw await this.parser.readError();

                default:
                    throw this.parser.unexpected(reply, 'DENT, DONE or FAIL');
            }
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
