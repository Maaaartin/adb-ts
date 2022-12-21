import { Writable } from 'stream';
import { LogcatReaderOptions } from '../util/types';
import { default as Reader } from './reader';

export function readStream(
    stream: Writable,
    options: LogcatReaderOptions
): Reader {
    return new Reader(options).connect(stream);
}
