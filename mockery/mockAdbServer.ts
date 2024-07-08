/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import net from 'net';
import { Parser } from '../lib/parser';
import { NonEmptyArray, Reply } from '../lib/util';
import { encodeData } from '../lib/util';
import { promisify } from 'util';

type Sequence =
    | { res: 'fail' | 'unexpected' }
    | {
          cmd: string;
          res?: {
              value?: string | Buffer;
              raw?: true;
          };
      };

type SequenceWithIndex = Sequence & {
    end?: boolean;
};

export const FailureError: Readonly<Error> = new Error('Failure');

export class AdbMock {
    protected server_ = new net.Server();
    protected parser: Parser | null = null;
    protected seq: Sequence[];

    protected get socket(): net.Socket {
        if (!this.parser) {
            throw new Error('Parser not initialized');
        }
        return this.parser?.socket;
    }

    constructor(seq: Sequence | NonEmptyArray<Sequence>) {
        this.seq = [seq].flat();
    }

    protected getPort(): number {
        const info = this.server_.address();
        if (typeof info === 'string' || info === null) {
            throw new Error('Could not get server port');
        }
        return info.port;
    }

    protected writeOkay(data: string | Buffer | void): void {
        const encoded = encodeData(data || '');
        const toWrite = Reply.OKAY.concat(encoded.toString());
        this.socket.write(toWrite);
    }

    protected writeFail(): void {
        const encoded = encodeData('Failure');
        const toWrite = Reply.FAIL.concat(encoded.toString());
        this.socket.write(toWrite);
    }

    protected writeRaw(data: string | Buffer | void): void {
        this.socket.write(
            Buffer.concat([Buffer.from(Reply.OKAY), Buffer.from(data || '')])
        );
    }

    protected writeUnexpected(msg = 'UNEX'): void {
        this.socket.write(msg);
    }

    protected next(): Sequence | null {
        return this.seq.shift() || null;
    }

    private async connectionHandler(socket: net.Socket): Promise<void> {
        this.parser = new Parser(socket);
        const value = (await this.parser.readValue()).toString();
        this.readableHandler();
        const nextSeq = this.next();
        if (!nextSeq) {
            return this.writeFail();
        }
        this.writeResponse(nextSeq, value);
    }

    protected async readValue(): Promise<string | undefined> {
        return (await this.parser?.readValue())?.toString();
    }

    protected writeResponse(seq: Sequence, value: string | undefined): void {
        switch (seq.res) {
            case 'unexpected':
                return this.writeUnexpected();
            case 'fail':
                return this.writeFail();
            default: {
                if (seq.res?.raw) {
                    return this.writeRaw(seq.res.value);
                }
                if (seq.cmd === value) {
                    return this.writeOkay(seq.res?.value);
                }

                throw new Error(`Expected ${seq.cmd} but got ${value}`);
            }
        }
    }

    protected readableHandler(): void {
        this.socket.once('readable', async () => {
            for await (const seq of this.seq) {
                this.writeResponse(seq, await this.readValue());
            }
            this.parser?.end();
        });
    }

    protected hook(): void {
        this.server_.on('connection', (socket) => {
            this.connectionHandler(socket);
        });
    }

    end(): Promise<void> {
        return promisify<void>((cb) => this.server_.close(cb))();
    }

    forceWriteData(data: string): void {
        const encoded = encodeData(data || '');
        this.socket.write(encoded);
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
                    } catch (e: unknown) {
                        reject(e);
                    }
                });
            } else {
                try {
                    resolve(this.getPort());
                } catch (e: unknown) {
                    reject(e);
                }
            }
        });
    }
}

export class AdbMockMulti extends AdbMock {
    constructor(seq: SequenceWithIndex | NonEmptyArray<SequenceWithIndex>) {
        super(seq);
    }

    private runner(): void {
        setImmediate(async () => {
            const seq = this.next() as SequenceWithIndex | null;
            if (!seq) {
                this.parser?.end();
                return;
            }

            this.writeResponse(seq, await this.readValue());
            if (seq.end) {
                this.socket.removeAllListeners('readable');
                this.socket.end();
                this.parser?.end();
            }
        });
    }

    protected readableHandler(): void {
        this.socket.on('readable', this.runner.bind(this));
    }
}
