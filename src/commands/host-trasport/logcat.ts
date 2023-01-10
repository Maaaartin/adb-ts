import LineTransform from '../../linetransform';
import { readStream } from '../../logcat';
import { LogcatReader } from '../../logcat/reader';
import { LogcatOptions } from '../../util/types';
import TransportCommand from '../abstract/transport';

export default class LogcatCommand extends TransportCommand<LogcatReader> {
    private logCat: LogcatReader | null = null;
    private options?: LogcatOptions | null;
    endConnection(): void {}
    protected postExecute(): Promise<LogcatReader> {
        const stream = new LineTransform({ autoDetect: true });
        this.connection.pipe(stream);
        this.logCat = readStream(stream, {
            filter: this.options?.filter
        });
        this.connection.on('error', (err) => this.logCat?.emit('error', err));
        this.logCat.on('end', () => {
            // TODO write test for ending
            super.endConnection();
        });
        return Promise.resolve(this.logCat);
    }
    Cmd = 'shell:echo && ';
    execute(serial: string, options?: LogcatOptions): Promise<LogcatReader> {
        let cmd = 'logcat -B *:I 2>/dev/null';
        if (options?.clear) {
            cmd = 'logcat -c 2>/dev/null && ' + cmd;
        }
        this.Cmd += cmd;
        this.options = options;

        return this.preExecute(serial).catch((err) => {
            super.endConnection();
            this.logCat?.end();
            throw err;
        });
    }
}
