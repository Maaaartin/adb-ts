import { Connection } from '../../connection';
import TransportCommand from '../abstract/transport';

export default class ClearCommand extends TransportCommand<void> {
    protected keepAlive = false;
    private pkg: string;

    constructor(connection: Connection, serial: string, pkg: string) {
        super(connection, serial);
        this.pkg = pkg;
    }

    protected get Cmd(): string {
        return 'shell:pm clear ' + this.pkg;
    }

    protected postExecute(): Promise<void> {
        return this.parser
            .searchLine(/^(Success|Failed)$/, false)
            .then(([result]) => {
                if (result !== 'Success') {
                    throw new Error(
                        `Package '${this.pkg}' could not be cleared`
                    );
                }
            });
    }
}
