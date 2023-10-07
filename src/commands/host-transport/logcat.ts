import { promisify } from 'util';
import { Connection } from '../../connection';
import LineTransform from '../../linetransform';
import { readStream } from '../../logcat';
import { LogcatReader } from '../../logcat/reader';
import { LogcatOptions } from '../../util';
import TransportCommand from '../abstract/transport';

export default class LogcatCommand extends TransportCommand<LogcatReader> {
    private options: LogcatOptions | void;
    protected Cmd = 'shell:echo && ';
    protected keepAlive = false;

    constructor(
        connection: Connection,
        serial: string,
        options: LogcatOptions | void
    ) {
        super(connection, serial);
        this.options = options;
        let cmd = 'logcat -B *:I 2>/dev/null';
        if (options?.clear) {
            cmd = 'logcat -c 2>/dev/null && ' + cmd;
        }
        this.Cmd = `shell:echo && ${cmd}`;
    }

    protected async postExecute(): Promise<LogcatReader> {
        const stream = new LineTransform({ autoDetect: true });
        this.connection.pipe(stream);
        await promisify<void>((cb) => stream.once('readable', cb))();
        const logCat = readStream(stream, {
            filter: this.options?.filter
        });
        this.connection.on('error', (err) => logCat.emit('error', err));
        logCat.on('end', () => this.endConnection());
        return logCat;
    }
}
