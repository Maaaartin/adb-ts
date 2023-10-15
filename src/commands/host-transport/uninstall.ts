import { Connection } from '../../connection';
import { UninstallOptions } from '../../util';
import TransportCommand from '../abstract/transport';

export default class UninstallCommand extends TransportCommand<void> {
    protected keepAlive = false;
    protected Cmd: string;

    constructor(
        connection: Connection,
        serial: string,
        pkg: string,
        options: UninstallOptions = {}
    ) {
        super(connection, serial);
        this.Cmd = ['shell:pm uninstall']
            .concat(options.keepCache ? '-k' : [])
            .concat(pkg)
            .join(' ');
    }

    protected async postExecute(): Promise<void> {
        try {
            await this.parser.searchLine(
                /^(Success|Failure.*|.*Unknown package:.*)$/
            );
        } finally {
            await this.parser.readAll();
        }
    }
}
