import Connection from '../../connection';
import TransportCommand from '../transport';

export default class MonkeyCommand extends TransportCommand<Connection> {
    Cmd = 'shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port ';
    protected postExecute(): Promise<Connection> {
        return this.parser.searchLine(/^:Monkey:/).then(() => {
            return this.connection;
        });
    }
    protected end(): Promise<void> {
        return Promise.resolve();
    }

    execute(serial: string, port: number | string): Promise<Connection> {
        this.Cmd += [port, '-v'].join(' ');
        return this.preExecute(serial).catch((err) => {
            return super.end().then(() => {
                throw err;
            });
        });
    }
}
