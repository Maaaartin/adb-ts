import net from 'net';
import TransportCommand from '../abstract/transport';

export default class GetIpAddressCommand extends TransportCommand<string[]> {
    protected Cmd = "shell:ip route | awk '{ print $9 }'";
    protected postExecute(): Promise<string[]> {
        return this.parser.readAll().then((value) =>
            value
                .toString()
                .split('\n')
                .map((v) => v.trim())
                .filter(net.isIP)
        );
    }

    execute(serial: string): Promise<string[]> {
        return this.preExecute(serial);
    }
}
