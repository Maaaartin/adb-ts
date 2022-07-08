import ipRegex from 'ip-regex';
import TransportCommand from '../tranport';

export default class GetIpAddressCommand extends TransportCommand<string> {
    protected postExecute(): Promise<string> {
        return this.parser.readAll().then((value) => {
            const valueStr = value.toString().trim();
            return ipRegex().test(valueStr) ? valueStr : '';
        });
    }
    get Cmd(): string {
        return "shell:ip route | awk '{ print $9 }'";
    }
    execute(serial: string): Promise<string> {
        return this.preExecute(serial);
    }
}
