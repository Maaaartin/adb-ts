import { Connection } from '../../connection';
import TransportCommand from '../abstract/transport';

export default class MonkeyCommand extends TransportCommand<Connection> {
    protected Cmd: string;
    protected keepAlive = true;

    constructor(connection: Connection, serial: string, port: number) {
        super(connection, serial);
        this.Cmd = [
            'shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port',
            port,
            '-v'
        ].join(' ');
    }

    protected async postExecute(): Promise<Connection> {
        await this.parser.searchLine(/^:Monkey:/);
        return this.connection;
    }
}
