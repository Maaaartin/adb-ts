import { Connection } from '../../connection';
import TransportCommand from '../abstract/transport';

export default class MonkeyCommand extends TransportCommand<Connection> {
    protected Cmd = 'shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port ';
    protected autoEnd = false;
    protected postExecute(): Promise<Connection> {
        return this.parser.searchLine(/^:Monkey:/).then(() => {
            return this.connection;
        });
    }

    execute(serial: string, port: number): Promise<Connection> {
        this.Cmd += [port, '-v'].join(' ');
        return this.preExecute(serial).catch((err) => {
            this.endConnection();
            throw err;
        });
    }
}
