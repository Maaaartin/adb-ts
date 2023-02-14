import net from 'net';
import TransportCommand from '../abstract/transport';

export default class GetIpAddressCommand extends TransportCommand<string[]> {
    protected keepAlive = false;
    protected Cmd = "shell:ip route | awk '{ print $9 }'";
    protected async postExecute(): Promise<string[]> {
        return (await this.parser.readAll())
            .toString()
            .split('\n')
            .map((v) => v.trim())
            .filter(net.isIP);
    }
}
