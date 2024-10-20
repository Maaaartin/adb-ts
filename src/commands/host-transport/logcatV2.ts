import { Connection } from '../../connection';
import LineTransform from '../../linetransform';
import { PriorityV2, TextParser, TextParserGrouped } from '../../logcat';
import { LogcatReaderV2, TextParserConstruct } from '../../logcat/reader';
import { FilterSpecs, LogcatOptionsV2 } from '../../util';
import LogcatBase from '../abstract/logcat';

export default class LogcatCommandV2 extends LogcatBase<
    LogcatReaderV2,
    LogcatOptionsV2
> {
    private parserClass: TextParserConstruct;
    protected logcatCmd = [
        'logcat',
        this.buildFilterSpecs(this.options?.filterSpecs),
        this.options?.filterSpecs?.silenceOthers
            ? `*:${PriorityV2.SILENT}`
            : '',
        '--format=printable,year,UTC 2>/dev/null'
    ]
        .filter(Boolean)
        .join(' ');
    constructor(
        connection: Connection,
        serial: string,
        options: LogcatOptionsV2 | void
    ) {
        super(connection, serial, options);
        if (options?.groupLogs) {
            this.parserClass = TextParserGrouped;
        } else {
            this.parserClass = TextParser;
        }
    }

    protected getReader(stream: LineTransform): LogcatReaderV2 {
        return new LogcatReaderV2(stream, this.parserClass);
    }

    private buildFilterSpecs(filterSpecs: FilterSpecs | void): string {
        if (!filterSpecs?.filters) {
            return '';
        }
        return filterSpecs.filters
            .map((filterSpec) => `${filterSpec.tag}:${filterSpec.priority}`)
            .join(' ');
    }
}
