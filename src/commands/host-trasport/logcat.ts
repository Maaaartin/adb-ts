import LineTransform from '../../linetransform';
import RawCommand from '../raw-command';
import { readStream } from '../../logcat';
import LogcatReader from '../../logcat/reader';
import { LogcatOptions } from '../../util/types';

export default class LogcatCommand extends RawCommand {
    Cmd = 'shell:echo && ';
    execute(serial: string, options?: LogcatOptions): Promise<LogcatReader> {
        let cmd = 'logcat -B *:I 2>/dev/null';
        if (options?.clear) {
            cmd = 'logcat -c 2>/dev/null && ' + cmd;
        }
        this.Cmd += cmd;
        let logCat: LogcatReader | null = null;
        return this.preExecute(serial)
            .then((result) => {
                const stream = new LineTransform({ autoDetect: true });
                result.pipe(stream);
                logCat = readStream(stream, {
                    filter: options?.filter
                });
                this.connection.on('error', (err) =>
                    logCat?.emit('error', err)
                );
                logCat.on('end', () => {
                    this.connection.end();
                });
                return logCat;
            })
            .catch((err) => {
                this.connection.end();
                logCat?.end();
                throw err;
            });
    }
}
