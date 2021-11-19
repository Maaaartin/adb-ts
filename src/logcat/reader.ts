import { EventEmitter } from "events";
import { Writable } from "stream";
import { LogcatReaderOptions } from "..";
import LogcatEntry from "./entry";
import LogcatParser from "./parser";
import Binary from "./parser/binary";
import Transform from './transform';

export default class LogcatReader extends EventEmitter {
    private filter?: (entry: LogcatEntry) => boolean;
    private parser: LogcatParser;
    private stream: Writable;
    private options: LogcatReaderOptions;
    constructor(options?: LogcatReaderOptions) {
        super();
        this.options = options;
        this.filter = options.filter;
        this.parser = new Binary();
    }

    setFilter(filter: (entry: LogcatEntry) => boolean) {
        this.filter = filter;
    }

    hook() {
        if (this.options.fixLineFeeds) {
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
            }
            else this.emit('entry', entry);
        });
        this.parser.on('error', (err) => {
            this.emit('error', err);
        })
    }

    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'entry', listener: (entry: LogcatEntry) => void): this;
    on(event: 'finish' | 'end', listener: VoidFunction): this;
    on(event: string | symbol, listener: (...args: any[]) => void) {
        return super.on(event, listener);
    }

    connect(stream: Writable) {
        this.stream = stream;
        this.hook();
        return this;
    };

    end() {
        this.stream.end();
        return this;
    };
}