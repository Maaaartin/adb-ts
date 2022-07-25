import TransportCommand from '../transport';

export default class GetIpAddressCommand extends TransportCommand<
    string | string[] | null
> {
    protected postExecute(): Promise<string | string[] | null> {
        return this.parser.readAll().then((value) => {
            const addresses = value.toString().trim().split('\n');
            if (!addresses[0]) {
                return null;
            }
            if (addresses.length === 1) {
                return addresses[0].trim();
            }
            return addresses.map((a) => a.trim());
        });
    }
    get Cmd(): string {
        return "shell:ip route | awk '{ print $9 }'";
    }
    execute(serial: string): Promise<string | string[] | null> {
        return this.preExecute(serial);
    }
}
