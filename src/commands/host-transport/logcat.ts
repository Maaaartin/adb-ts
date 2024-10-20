import { promisify } from 'util';
import LineTransform from '../../linetransform';
import { readStream } from '../../logcat';
import { LogcatReader } from '../../logcat/reader';
import { LogcatOptions } from '../../util';
import LogcatBase from '../abstract/logcat';

export default class LogcatCommand extends LogcatBase<
    LogcatReader,
    LogcatOptions
> {
    protected logcatCmd = 'logcat -B *:I 2>/dev/null';
    protected async getReader(stream: LineTransform): Promise<LogcatReader> {
        await promisify<unknown>((cb) => stream.once('readable', cb))();
        const logCat = readStream(stream, {
            filter: this.options?.filter
        });
        this.connection.on('error', (err) => logCat.emit('error', err));
        return logCat;
    }
}
