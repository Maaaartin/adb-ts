import { Connection } from '../../connection';
import LineTransform from '../../linetransform';
import LogcatReader from '../../logcat/v2/reader';
import { LogcatOptions } from '../../util';
import TransportCommand from '../abstract/transport';
// import { createWriteStream } from 'fs';

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
        let cmd = 'logcat *:I --format=printable,year 2>/dev/null';
        if (options?.clear) {
            cmd = 'logcat -c 2>/dev/null && ' + cmd;
        }
        this.Cmd = `shell:echo && ${cmd}`;
    }

    protected postExecute(): LogcatReader {
        const stream = new LineTransform({ autoDetect: true });
        this.connection.pipe(stream);
        // const fileStream = createWriteStream('./output_binary.log');

        // stream.pipe(fileStream);
        // return null;
        stream.once('end', () => this.endConnection());
        return new LogcatReader(stream, this.options);
    }
}
