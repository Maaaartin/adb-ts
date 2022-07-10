import net from 'net';
import Parser from '../lib/parser';
import { encodeData, NonEmptyArray, Reply } from '../lib';
import { promisify } from 'util';

type MockServerOptions = {
    expValue: string;
    expValue2?: string;
    unexpected?: boolean;
    res?: string;
    res2?: string;
    withEncode?: boolean;
};
export const mockServer = async ({
    expValue,
    expValue2 = '',
    unexpected = false,
    res = '',
    res2 = '',
    withEncode
}: MockServerOptions): Promise<{
    done: () => Promise<void>;
    port: number;
    write: (data: string) => void;
    writeData: (data: string) => void;
}> => {
    let socket_: net.Socket | null = null;
    const write_ = (reply: string | null = null, data: string): void => {
        const encoded = encodeData(data);
        const toWrite = (reply ?? '').concat(
            data || withEncode ? encoded.toString() : ''
        );
        socket_?.write(toWrite);
    };

    const server = await new Promise<net.Server>((resolve, reject) => {
        const server_ = new net.Server();
        server_.listen(0, () => {
            resolve(server_);
        });

        server_.on('connection', async (socket) => {
            socket_ = socket;
            const parser = new Parser(socket);
            const value = await parser.readValue();
            if (res2 && expValue2) {
                socket.on('readable', async () => {
                    const value2 = await parser.readValue();
                    if (expValue2 === value2.toString()) {
                        // write_(Reply.OKAY, res2);
                        socket.write('OKAY' + res2);
                        socket.end();
                    } else {
                        write_(Reply.FAIL, 'Failure');
                    }
                });
            }
            if (unexpected) {
                socket.write('YOYO');
            } else if (expValue === value.toString()) {
                write_(Reply.OKAY, res);
            } else {
                write_(Reply.FAIL, 'Failure');
            }
        });
        server_.once('error', reject);
    });
    const done = (): Promise<void> => {
        return promisify<void>((cb) => server?.close(cb) || cb(null))();
    };
    const write = (data: string): void => {
        write_(Reply.OKAY, data);
    };
    const writeData = (data: string): void => {
        write_(null, data);
    };
    const port = getPort(server);
    return { done, port, write, writeData };
};

export const getPort = (server: net.Server): number => {
    const info = server.address();
    if (typeof info === 'string' || info === null) {
        throw new Error('Could not get server port');
    }
    return info.port;
};

type Sequence = {
    cmd: string;
    res: string | null;
    rawRes?: boolean;
    unexpected?: boolean;
};
export class AdbMock {
    private server_ = new net.Server();
    private parser: Parser | null = null;
    private seq: Generator<Sequence, void, void>;

    private get socket(): net.Socket | null | undefined {
        return this.parser?.socket;
    }

    constructor(seq: Sequence | NonEmptyArray<Sequence>) {
        seq = Array.isArray(seq) ? seq : [seq];
        this.seq = (function* (): Generator<Sequence, void, void> {
            for (const s of seq) {
                yield s;
            }
        })();
    }

    private getPort(): number {
        const info = this.server_.address();
        if (typeof info === 'string' || info === null) {
            throw new Error('Could not get server port');
        }
        return info.port;
    }

    private writeOkay(data: string | null): void {
        const encoded = encodeData(data || '');
        const toWrite = Reply.OKAY.concat(encoded.toString());
        this.socket?.write(toWrite);
    }

    private writeFail(): void {
        const encoded = encodeData('Failure');
        const toWrite = Reply.FAIL.concat(encoded.toString());
        this.socket?.write(toWrite);
    }

    private writeRaw(data: string | null): void {
        this.socket?.write(Reply.OKAY.concat(data || ''));
    }

    private next(): Sequence | null {
        const nextSeq = this.seq.next();
        if (nextSeq.done) {
            return null;
        }
        return nextSeq.value;
    }

    private connectionHandler(value: string): void {
        const nextSeq = this.next();
        if (nextSeq?.unexpected) {
            this.socket?.write('ABCD');
            return;
        }
        if (value === nextSeq?.cmd) {
            if (nextSeq.rawRes) {
                return this.writeRaw(nextSeq.res);
            }
            return this.writeOkay(nextSeq.res);
        }

        return this.writeFail();
    }

    private async readValue(): Promise<string | undefined> {
        return (await this.parser?.readValue())?.toString();
    }
    private handleSequence(): void {
        this.socket?.on('readable', async () => {
            for await (const seq of this.seq) {
                const value = await this.readValue();
                if (seq.cmd === value) {
                    if (seq.rawRes) {
                        this.writeRaw(seq.res);
                    } else {
                        this.writeOkay(seq.res);
                    }
                } else {
                    this.writeFail();
                }
            }
            this.parser?.end();
        });
    }

    private hook(): void {
        this.server_.once('connection', async (socket) => {
            this.parser = new Parser(socket);
            const value = (await this.parser.readValue()).toString();
            this.connectionHandler(value);
            this.handleSequence();
        });
    }

    end(): Promise<void> {
        return promisify<void>((cb) => this.server_.close(cb) || cb(null))();
    }

    forceWriteData(data: string): void {
        const encoded = encodeData(data || '');
        this.socket?.write(encoded);
    }

    forceWrite(data: string): void {
        this.writeOkay(data);
    }

    start(): Promise<number> {
        return new Promise((resolve, reject) => {
            if (!this.server_.listening) {
                this.server_.once('error', reject);
                this.server_.listen(() => {
                    try {
                        this.hook();
                        resolve(this.getPort());
                        this.server_.removeListener('error', reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            } else {
                try {
                    resolve(this.getPort());
                } catch (e) {
                    reject(e);
                }
            }
        });
    }
}
