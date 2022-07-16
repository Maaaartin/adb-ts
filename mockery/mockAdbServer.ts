import net from 'net';
import Parser from '../lib/parser';
import { encodeData, NonEmptyArray, Reply } from '../lib';
import { promisify } from 'util';

type Sequence = {
    cmd: string;
    res: string | null;
    rawRes?: boolean;
    unexpected?: boolean;
};
export default class AdbMock {
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

    private writeUnexpected(): void {
        this.socket?.write('ABCD');
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
            return this.writeUnexpected();
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
                if (seq.unexpected) {
                    this.writeUnexpected();
                    continue;
                }
                const value = await this.readValue();
                if (seq.cmd === value) {
                    if (seq.rawRes) {
                        this.writeRaw(seq.res);
                        continue;
                    }
                    this.writeOkay(seq.res);
                    continue;
                }
                this.writeFail();
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
