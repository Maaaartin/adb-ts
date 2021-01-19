import { Writable } from 'stream';
import { LogcatReaderOptions } from '..';
import { default as Reader } from './reader';

export default class Logcat {
    public static readStrem(stream: Writable, options: LogcatReaderOptions) {
        return new Reader(options).connect(stream);
    }
    public static readonly Reader = Reader;
}

