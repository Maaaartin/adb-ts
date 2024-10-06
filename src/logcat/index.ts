import { Writable } from 'stream';
import { LogcatReaderOptions } from '../util';
import { LogcatReader } from './reader';

export { default as LogcatReaderV2 } from './v2/reader';
export { default as LogcatParserV2 } from './v2/parser';
export {
    default as LineTransform,
    LineTransformOptions
} from '../linetransform';
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
