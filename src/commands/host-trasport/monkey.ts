import { Connection } from '../../connection';
import TransportCommand from '../abstract/transport';

export default class MonkeyCommand extends TransportCommand<Connection> {
    Cmd = 'shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port ';
    protected postExecute(): Promise<Connection> {
        return this.parser.searchLine(/^:Monkey:/).then(() => {
            return this.connection;
        });
    }

    endConnection(): void {}

    execute(serial: string, port: number): Promise<Connection> {
        this.Cmd += [port, '-v'].join(' ');
        return this.preExecute(serial).catch((err) => {
            super.endConnection();
            throw err;
        });
    }
}
