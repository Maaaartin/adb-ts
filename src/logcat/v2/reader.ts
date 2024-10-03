import { LogcatReaderOptions } from '../../util';
import Parser from './parser';
import { LogcatEntry } from '../entry';
import LineTransform from '../../linetransform';

export default class LogcatReader {
    private filter: ((entry: LogcatEntry) => boolean) | void;
    private parser = new Parser();
    private stream: LineTransform;
    constructor(stream: LineTransform, options: LogcatReaderOptions | void) {
        this.stream = stream;
        this.filter = options?.filter;
    }

    public async *logs(): AsyncIterableIterator<LogcatEntry> {
        for await (const chunk of this.stream.iterator({
            destroyOnReturn: false
        })) {
            for (const entry of this.parser.parse(chunk)) {
                if (!this.filter || this.filter(entry)) {
                    yield entry;
                }
            }
        }
    }

    public end(): void {
        this.stream.end();
    }
}
