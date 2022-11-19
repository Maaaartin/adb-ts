import { FailError } from '../..';
import TransportCommand from '../transport';

export default class TcpIpCommand extends TransportCommand<void> {
    Cmd = 'tcpip:';
    protected postExecute(): Promise<void> {
        return this.parser.readAll().then((value) => {
            const valueStr = value.toString().trim();
            if (!/restarting in/.test(valueStr)) {
                throw new FailError(valueStr || 'No error message');
            }
        });
    }
    execute(serial: string, port: number | string): Promise<void> {
        this.Cmd += `${port}`;
        return this.preExecute(serial);
    }
}
