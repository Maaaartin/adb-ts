import { NotConnectedError } from '../util';
import StreamHandler from '../streamHandler';
import { Binary } from './parser/binary';
import { LogcatEntry } from './entry';
import { Parser as LogcatParser } from './parser';
import { Writable } from 'stream';
import { LogcatReaderOptions } from '../util';

export class LogcatReader extends StreamHandler {
    private filter?: (entry: LogcatEntry) => boolean;
    private parser: LogcatParser;
    private stream_?: Writable;
    constructor(options?: LogcatReaderOptions) {
        super();
        this.filter = options?.filter;
        this.parser = new Binary();
    }

    private get stream(): Writable {
        if (this.stream_) {
            return this.stream_;
        } else {
            throw new NotConnectedError();
        }
    }

    hook(): void {
        this.stream.on('data', (data) => {
            this.parser.parse(data);
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
            if (this.filter) {
                if (this.filter(entry)) {
                    this.emit('entry', entry);
                }
            } else {
                this.emit('entry', entry);
            }
        });
        this.parser.on('error', (err) => {
            this.emit('error', err);
        });
    }

    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'entry', listener: (entry: LogcatEntry) => void): this;
    on(event: 'finish' | 'end', listener: () => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }

    connect(stream: Writable): this {
        this.stream_ = stream;
        this.hook();
        return this;
    }

    end(): void {
        this.stream.end();
    }
}
