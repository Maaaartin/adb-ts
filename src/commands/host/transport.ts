import { Connection } from '../../connection';
import Command from '../command';
export default class HostTransportCommand extends Command<void> {
    protected autoEnd = false;
    private serial: string;

    constructor(connection: Connection, serial: string) {
        super(connection);
        this.serial = serial;
    }

    public async execute(): Promise<void> {
        try {
            await this.initAndValidateReply(`host:transport:${this.serial}`);
        } catch (err) {
            this.endConnection();
            throw err;
        }
    }
}
