import RestartConnection from '../restartConnection';

export default class TcpIpCommand extends RestartConnection {
    Cmd = 'tcpip:';

    execute(serial: string, port: number | string): Promise<void> {
        this.Cmd += `${port}`;
        return this.preExecute(serial);
    }
}
