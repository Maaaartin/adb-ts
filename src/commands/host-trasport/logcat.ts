import LineTransform from '../../linetransform';
import RawCommand from '../raw-command';
import { LogcatOptions } from '../..';
import { readStream } from '../../logcat';
import LogcatReader from '../../logcat/reader';

export default class LogcatCommand extends RawCommand {
    Cmd = 'shell:echo && ';
    private logCat?: LogcatReader;
    execute(serial: string, options?: LogcatOptions): Promise<LogcatReader> {
        let cmd = 'logcat -B *:I 2>/dev/null';
        if (options?.clear) {
            cmd = 'logcat -c 2>/dev/null && ' + cmd;
        }
        this.Cmd += cmd;
        return this.preExecute(serial)
            .then((result) => {
                const stream = new LineTransform({ autoDetect: true });
                result.pipe(stream);
                const logCat = readStream(stream, {
                    ...options,
                    fixLineFeeds: false
                });
                this.connection.on('error', (err) => logCat.emit('error', err));
                logCat.on('end', () => {
                    this.finalize();
                });
                this.logCat = logCat;
                return logCat;
            })
            .catch((err) => {
                if (this.logCat) {
                    return this.logCat.end().then(() => {
                        throw err;
                    });
                }
                throw err;
            });
    }
}
