import { Connection } from '../../connection';
import LineTransform from '../../linetransform';
import { PriorityV2, TextParser, TextParserGrouped } from '../../logcat';
import { LogcatReaderV2, TextParserConstruct } from '../../logcat/reader';
import { FilterSpecs, LogcatOptionsV2 } from '../../util';
import TransportCommand from '../abstract/transport';
// import { createWriteStream } from 'fs';

export default class LogcatCommandV2 extends TransportCommand<LogcatReaderV2> {
    protected Cmd = 'shell:echo && ';
    protected keepAlive = true;
    private parserClass: TextParserConstruct;

    constructor(
        connection: Connection,
        serial: string,
        options: LogcatOptionsV2 | void
    ) {
        super(connection, serial);
        let cmd = [
            'logcat',
            this.buildFilterSpecs(options?.filterSpecs),
            options?.filterSpecs?.silenceOthers ? `*:${PriorityV2.SILENT}` : '',
            '--format=printable,year,UTC 2>/dev/null'
        ]
            .filter(Boolean)
            .join(' ');
        if (options?.clear) {
            cmd = 'logcat -c 2>/dev/null && ' + cmd;
        }
        if (options?.groupLogs) {
            this.parserClass = TextParserGrouped;
        } else {
            this.parserClass = TextParser;
        }
        this.Cmd = `shell:echo && ${cmd}`;
    }

    private buildFilterSpecs(filterSpecs: FilterSpecs | void): string {
        if (!filterSpecs?.filters) {
            return '';
        }
        return filterSpecs.filters
            .map((filterSpec) => `${filterSpec.tag}:${filterSpec.priority}`)
            .join(' ');
    }

    protected postExecute(): LogcatReaderV2 {
        const stream = new LineTransform({ autoDetect: true });
        this.connection.pipe(stream);
        // const fileStream = createWriteStream('./output.log');

        // stream.pipe(fileStream);
        // return null;
        stream.once('end', () => this.endConnection());
        return new LogcatReaderV2(stream, this.parserClass);
    }
}
