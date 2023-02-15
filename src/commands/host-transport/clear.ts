import { Connection } from '../../connection';
import TransportCommand from '../abstract/transport';

export default class ClearCommand extends TransportCommand<void> {
    protected Cmd: string;
    protected keepAlive = false;
    private pkg: string;

    constructor(connection: Connection, serial: string, pkg: string) {
        super(connection, serial);
        this.pkg = pkg;
        this.Cmd = `shell:pm clear ${pkg}`;
    }

    protected async postExecute(): Promise<void> {
        const [result] = await this.parser.searchLine(
            /^(Success|Failed)$/,
            false
        );
        if (result !== 'Success') {
            throw new Error(`Package '${this.pkg}' could not be cleared`);
        }
    }
}
