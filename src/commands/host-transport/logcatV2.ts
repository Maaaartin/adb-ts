import { Connection } from '../../connection';
import LineTransform from '../../linetransform';
import { PriorityV2 } from '../../logcat';
import LogcatReader from '../../logcat/v2/reader';
import { FilterSpecs, LogcatOptionsV2 } from '../../util';
import TransportCommand from '../abstract/transport';
// import { createWriteStream } from 'fs';

export default class LogcatCommandV2 extends TransportCommand<LogcatReader> {
    private options: LogcatOptionsV2 | void;
    protected Cmd = 'shell:echo && ';
    protected keepAlive = true;

    constructor(
        connection: Connection,
        serial: string,
        options: LogcatOptionsV2 | void
    ) {
        super(connection, serial);
        this.options = options;
        let cmd = `logcat ${this.buildFilterSpecs(options?.filterSpecs)} ${options?.filterSpecs?.silenceOthers ? `*:${PriorityV2.SILENT}` : ''} --format=printable,year 2>/dev/null`;
        if (options?.clear) {
            cmd = 'logcat -c 2>/dev/null && ' + cmd;
        }
        this.Cmd = `shell:echo && ${cmd}`;
    }

    private buildFilterSpecs(filterSpecs: FilterSpecs | void): string {
        if (!filterSpecs) {
            return '';
        }
        return filterSpecs.filters
            .map((filterSpec) => `${filterSpec.tag}:${filterSpec.priority}`)
            .join(' ');
    }

    protected postExecute(): LogcatReader {
        const stream = new LineTransform({ autoDetect: true });
        this.connection.pipe(stream);
        // const fileStream = createWriteStream('./output_binary.log');

        // stream.pipe(fileStream);
        // return null;
        stream.once('end', () => this.endConnection());
        return new LogcatReader(stream);
    }
}
