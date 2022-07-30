import Connection from '../../connection';
import RawCommand from '../raw-command';

export default class TcpCommand extends RawCommand {
    Cmd = 'tcp:';

    execute(
        serial: string,
        port: number | string,
        host?: string
    ): Promise<Connection> {
        this.Cmd += host ? host + ':' + port : port;
        return this.preExecute(serial).catch((err) => {
            return this.finalize().then(() => {
                throw err;
            });
        });
    }
}
