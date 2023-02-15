import { Connection } from '../../connection';
import Command from '../command';
export default class HostTransportCommand extends Command<void> {
    protected autoEnd = false;
    private serial: string;

    constructor(connection: Connection, serial: string) {
        super(connection);
        this.serial = serial;
    }

    public execute(): Promise<void> {
        return this.initExecute('host:transport:' + this.serial)
            .then(this.handleReply(undefined))
            .catch((err) => {
                this.endConnection();
                throw err;
            });
    }
}
