import { Writable } from 'stream';
import { LogcatReaderOptions } from '../util';
import { LogcatReader } from './reader';

export * from './reader';
export * from './parser/binary';
export * from './parser';
export * from './priority';
export * from './entry';

export function readStream(
    stream: Writable,
    options: LogcatReaderOptions
): LogcatReader {
    return new LogcatReader(options).connect(stream);
}
