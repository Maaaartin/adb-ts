import { Connection } from '../../connection';
import RawCommand from '../abstract/raw';

export default class TcpCommand extends RawCommand {
    protected Cmd = 'tcp:';

    execute(serial: string, port: number, host?: string): Promise<Connection> {
        this.Cmd += host ? host + ':' + port : port;
        return this.preExecute(serial).catch((err) => {
            this.connection.end();
            throw err;
        });
    }
}
