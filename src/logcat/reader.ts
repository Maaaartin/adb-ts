import { LogcatReaderOptions, NotConnectedError } from '..';
import StreamHandler from '../streamHandler';
import Binary from './parser/binary';
import LogcatEntry from './entry';
import LogcatParser from './parser';

import Transform from './transform';
import { Writable } from 'stream';

export default class LogcatReader extends StreamHandler {
    private filter?: (entry: LogcatEntry) => boolean;
    private parser: LogcatParser;
    private stream_?: Writable;
    private options?: LogcatReaderOptions;
    constructor(options?: LogcatReaderOptions) {
        super();
        this.options = options;
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

    setFilter(filter: (entry: LogcatEntry) => boolean): void {
        this.filter = filter;
    }

    hook(): void {
        if (this.options?.fixLineFeeds) {
            const transform = this.stream.pipe(new Transform());
            transform.on('data', (data) => {
                return this.parser.parse(data);
            });
        } else {
            this.stream.on('data', (data) => {
                return this.parser.parse(data);
            });
        }
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
                if (this.filter(entry)) this.emit('entry', entry);
            } else this.emit('entry', entry);
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

    end(): Promise<void> {
        return new Promise<void>((resolve) => this.stream.end(resolve));
    }
}
