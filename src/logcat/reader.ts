import { NotConnectedError } from '../util';
import StreamHandler from '../streamHandler';
import { BinaryParser, TextParserBase } from './parser';
import { LogcatEntry, LogcatEntryV2 } from './entry';
import { Writable } from 'stream';
import { LogcatReaderOptions } from '../util';
import LineTransform from '../linetransform';

export class LogcatReader extends StreamHandler {
    private filter: ((entry: LogcatEntry) => boolean) | void;
    private parser = new BinaryParser();
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

/**
 * @ignore
 */
export interface TextParserConstruct {
    new (): TextParserBase;
}

export class LogcatReaderV2 {
    private parser: TextParserBase;
    private stream: LineTransform;
    /**
     * @ignore
     */
    constructor(stream: LineTransform, parserCtor: TextParserConstruct) {
        this.stream = stream;
        this.parser = new parserCtor();
    }

    public async *logs(): AsyncIterableIterator<LogcatEntryV2> {
        for await (const chunk of this.stream.iterator({
            destroyOnReturn: false
        })) {
            yield* this.parser.parse(chunk);
        }
    }

    public end(): void {
        this.stream.end();
    }
}
