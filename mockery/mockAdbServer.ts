import net from 'net';
import Parser from '../lib/parser';
import { encodeData, Reply } from '../lib';
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

export type Sequence = { cmd: string; res?: string };
export class AdbMock {
    private server_ = new net.Server();
    // private socket_: net.Socket | null = null;
    private parser: Parser | null = null;
    private seq: Generator<Sequence, void, void>;
    private unexpected?: boolean;

    private get socket(): net.Socket | null | undefined {
        return this.parser?.socket;
    }

    constructor({
        seq,
        unexpected
    }: {
        seq: Generator<Sequence, void, void>;
        unexpected?: boolean;
    }) {
        this.seq = seq;
        this.unexpected = unexpected;
    }

    private writeOkay(data = ''): void {
        const encoded = encodeData(data);
        const toWrite = Reply.OKAY.concat(data ? encoded.toString() : '');
        this.socket?.write(toWrite);
    }

    private writeFail(): void {
        const encoded = encodeData('Failure');
        const toWrite = Reply.FAIL.concat(encoded.toString());
        this.socket?.write(toWrite);
    }

    private next(): Sequence | null {
        const nextSeq = this.seq.next();
        if (nextSeq.done) {
            return null;
        }
        return nextSeq.value;
    }

    private connectionHandler(value: string): void {
        if (this.unexpected) {
            this.socket?.write('ABCD');
            return;
        }
        const nextSeq = this.next();
        if (value === nextSeq?.cmd) {
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
                    this.writeOkay(seq.res);
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

    start(): Promise<number> {
        return new Promise((resolve, reject) => {
            if (!this.server_.listening) {
                this.server_.once('error', reject);
                this.server_.listen(() => {
                    this.hook();
                    resolve(getPort(this.server_));
                    this.server_.removeListener('error', reject);
                });
            } else {
                resolve(getPort(this.server_));
            }
        });
    }
}
