import { Connection } from '../../connection';
import LineTransform from '../../linetransform';
import { readStream } from '../../logcat';
import { LogcatReader } from '../../logcat/reader';
import { LogcatOptions } from '../../util';
import TransportCommand from '../abstract/transport';

export default class LogcatCommand extends TransportCommand<LogcatReader> {
    private logCat: LogcatReader | null = null;
    private options?: LogcatOptions | null;
    protected Cmd = 'shell:echo && ';
    protected keepAlive = false;

    constructor(
        connection: Connection,
        serial: string,
        options?: LogcatOptions
    ) {
        super(connection, serial);
        let cmd = 'logcat -B *:I 2>/dev/null';
        if (options?.clear) {
            cmd = 'logcat -c 2>/dev/null && ' + cmd;
        }
        this.Cmd = `shell:echo && ${cmd}`;
    }

    protected postExecute(): LogcatReader {
        const stream = new LineTransform({ autoDetect: true });
        this.connection.pipe(stream);
        this.logCat = readStream(stream, {
            filter: this.options?.filter
        });
        this.connection.on('error', (err) => this.logCat?.emit('error', err));
        this.logCat.on('end', () => this.endConnection());
        return this.logCat;
    }

    public async execute(): Promise<LogcatReader> {
        try {
            return await super.execute();
        } catch (err) {
            // TODO test, is needed?
            this.logCat?.end();
            throw err;
        }
    }
}
