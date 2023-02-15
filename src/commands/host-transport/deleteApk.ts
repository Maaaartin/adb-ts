import { Connection } from '../../connection';
import { escape } from '../../util';
import TransportCommand from '../abstract/transport';

export default class DeleteApk extends TransportCommand<void> {
    protected keepAlive = false;
    protected Cmd: string;

    constructor(connection: Connection, serial: string, apk: string) {
        super(connection, serial);
        this.Cmd = 'shell:rm -f '.concat(escape(apk));
    }

    protected async postExecute(): Promise<void> {
        await this.parser.readAll();
    }
}
