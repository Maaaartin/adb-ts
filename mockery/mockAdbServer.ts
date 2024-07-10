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

type EndSequence = Sequence & {
    end?: boolean;
};

export class AdbMock<T extends Sequence> {
    protected server_ = new net.Server();
    protected parser: Parser | null = null;
    protected seq: IterableIterator<T>;

    protected get socket(): net.Socket {
        if (!this.parser) {
            throw new Error('Parser not initialized');
        }
        return this.parser?.socket;
    }

    constructor(seq: T | NonEmptyArray<T>) {
        this.seq = ([seq].flat() as T[])[Symbol.iterator]();
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

    protected get Next(): T | void {
        return this.seq.next()?.value;
    }

    private async connectionHandler(socket: net.Socket): Promise<void> {
        this.parser = new Parser(socket);
        const value = (await this.parser.readValue()).toString();
        this.readableHandler();
        const nextSeq = this.Next;
        if (!nextSeq) {
            return this.writeFail();
        }
        this.writeResponse(nextSeq, value);
    }

    protected async readValue(): Promise<string | void> {
        return (await this.parser?.readValue())?.toString();
    }

    protected writeResponse(seq: T, value: string | void): void {
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
            for (const seq of this.seq) {
                this.writeResponse(seq, await this.readValue());
            }
            this.parser?.end();
        });
    }

    public end(): Promise<void> {
        return promisify<void>((cb) => this.server_.close(cb))();
    }

    public forceWriteData(data: string): void {
        const encoded = encodeData(data || '');
        this.socket.write(encoded);
    }

    public forceWrite(data: string): void {
        this.writeOkay(data);
    }

    public start(): Promise<number> {
        return new Promise((resolve, reject) => {
            if (this.server_.listening) {
                return reject(new Error('Server already started'));
            }
            this.server_.once('error', reject);
            this.server_.listen(() => {
                try {
                    this.server_.on(
                        'connection',
                        this.connectionHandler.bind(this)
                    );
                    const info = this.server_.address();
                    if (typeof info === 'string' || info === null) {
                        return reject(new Error('Could not get server port'));
                    }
                    resolve(info.port);
                    this.server_.removeListener('error', reject);
                } catch (e: unknown) {
                    reject(e);
                }
            });
        });
    }
}

export class AdbMockMulti extends AdbMock<EndSequence> {
    private runner(): void {
        setImmediate(async () => {
            const seq = this.Next;
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
