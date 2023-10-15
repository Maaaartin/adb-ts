import { NotConnectedError } from '../util';
import StreamHandler from '../streamHandler';
import { Binary } from './parser/binary';
import { LogcatEntry } from './entry';
import { Writable } from 'stream';
import { LogcatReaderOptions } from '../util';

export class LogcatReader extends StreamHandler {
    private filter: ((entry: LogcatEntry) => boolean) | void;
    private parser = new Binary();
    private stream_: Writable | null = null;
    constructor(options?: LogcatReaderOptions) {
        super();
        this.filter = options?.filter;
    }

    private get stream(): Writable {
        if (!this.stream_) {
            throw new NotConnectedError();
        }
        return this.stream_;
    }

    private hook(): void {
        this.stream.on('data', (data) => {
            if (Buffer.isBuffer(data)) {
                return this.parser.parse(data);
            }
            this.emit('error', new Error('Invalid data'));
        });

        this.stream.on('error', (err) => {
            this.emit('error', err);
        });
        this.stream.on('end', () => {
            this.emit('end');
        });
        this.stream.on('finish', () => {
            this.emit('finish');
        });
        this.parser.on('entry', (entry: LogcatEntry) => {
            if (!this.filter || this.filter(entry)) {
                this.emit('entry', entry);
            }
        });
        this.parser.on('error', (err) => {
            this.emit('error', err);
        });
    }

    public on(event: 'error', listener: (err: Error) => void): this;
    public on(event: 'entry', listener: (entry: LogcatEntry) => void): this;
    public on(event: 'finish' | 'end', listener: () => void): this;
    public on(
        event: string | symbol,
        listener: ((entry: LogcatEntry) => void) | ((err: Error) => void)
    ): this {
        return super.on(event, listener);
    }

    public connect(stream: Writable): this {
        this.stream_ = stream;
        this.hook();
        return this;
    }

    public end(): void {
        this.stream.end();
    }
}
