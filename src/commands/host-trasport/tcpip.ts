import RestartConnection from '../abstract/restartConnection';

export default class TcpIpCommand extends RestartConnection {
    protected keepAlive = true;
    protected Cmd = 'tcpip:';

    execute(serial: string, port: number): Promise<void> {
        this.Cmd += `${port}`;
        return this.preExecute(serial);
    }
}
