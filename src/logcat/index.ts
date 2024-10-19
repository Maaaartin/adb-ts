import { Writable } from 'stream';
import { LogcatReaderOptions } from '../util';
import { LogcatReader } from './reader';

export {
    default as LineTransform,
    LineTransformOptions
} from '../linetransform';
export * from './reader';
export * from './parser';
export * from './priority';
export * from './entry';

/**
 * @ignore
 */
export function readStream(
    stream: Writable,
    options: LogcatReaderOptions
): LogcatReader {
    return new LogcatReader(options).connect(stream);
}
