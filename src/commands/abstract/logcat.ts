import { Connection } from '../../connection';
import LineTransform from '../../linetransform';
import { LogcatOptionsBase } from '../../util';
import TransportCommand from '../abstract/transport';

export default abstract class LogcatCommand<
    T,
    O extends LogcatOptionsBase
> extends TransportCommand<T> {
    protected abstract logcatCmd: string;
    protected options: O | void;
    protected keepAlive = true;
    protected get Cmd(): string {
        return [
            'shell:echo',
            this.options?.clear ? 'logcat -c 2>/dev/null' : '',
            this.logcatCmd
        ]
            .filter(Boolean)
            .join(' && ');
    }

    constructor(connection: Connection, serial: string, options: O | void) {
        super(connection, serial);
        this.options = options;
    }

    protected abstract getReader(stream: LineTransform): T | Promise<T>;

    protected postExecute(): T | Promise<T> {
        const stream = new LineTransform({ autoDetect: true });
        this.connection.pipe(stream);
        stream.once('end', () => this.endConnection());
        return this.getReader(stream);
    }
}
