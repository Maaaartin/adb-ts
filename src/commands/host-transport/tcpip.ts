import { Connection } from '../../connection';
import RestartConnection from '../abstract/restartConnection';

export default class TcpIpCommand extends RestartConnection {
    protected keepAlive = true;
    protected Cmd: string;

    constructor(
        connection: Connection,
        serial: string,
        awaiter: Promise<void>,
        port: number
    ) {
        super(connection, serial, awaiter);
        this.Cmd = `tcpip:${port}`;
    }
}
