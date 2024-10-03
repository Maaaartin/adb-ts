import { promisify } from 'util';
import { Connection } from '../../connection';
import LineTransform from '../../linetransform';
import LogcatReader from '../../logcat/v2/reader';
import { LogcatOptions } from '../../util';
import TransportCommand from '../abstract/transport';

export default class LogcatCommandV2 extends TransportCommand<LogcatReader> {
    private options: LogcatOptions | void;
    protected Cmd = 'shell:echo && ';
    protected keepAlive = true;

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
        await promisify<unknown>((cb) => stream.once('readable', cb))();
        return new LogcatReader(stream, this.options);
        // TODO test connection
        // this.connection.on('error', (err) => logCat.emit('error', err));
        // logCat.on('end', () => this.endConnection());
    }
}
