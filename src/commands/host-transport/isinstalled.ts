import { Connection } from '../../connection';
import TransportCommand from '../abstract/transport';

export default class IsInstalledCommand extends TransportCommand<boolean> {
    protected keepAlive = false;
    protected Cmd: string;

    constructor(connection: Connection, serial: string, pkg: string) {
        super(connection, serial);
        this.Cmd = `shell:pm path ${pkg} 2>/dev/null`;
    }

    protected postExecute(): Promise<boolean> {
        return this.parser.readAscii(8).then(
            (reply) => {
                if (reply === 'package:') {
                    return true;
                }
                throw this.parser.unexpected(reply, 'package:');
            },
            () => false
        );
    }
}
