import Parser from './parser';
import { LogcatEntryV2 } from '../entry';
import LineTransform from '../../linetransform';

export default class LogcatReader {
    private parser = new Parser();
    private stream: LineTransform;
    constructor(stream: LineTransform) {
        this.stream = stream;
    }

    public async *logs(): AsyncIterableIterator<LogcatEntryV2> {
        for await (const chunk of this.stream.iterator({
            destroyOnReturn: false
        })) {
            for (const entry of this.parser.parse(chunk)) {
                yield entry;
            }
        }
    }

    public end(): void {
        this.stream.end();
    }
}
