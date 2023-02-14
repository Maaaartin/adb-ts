import { Connection } from '../../connection';
import Cmd from './cmd';

export default abstract class TransportCommand<T> extends Cmd<T> {
    private serial: string;
    protected autoEnd = false;
    protected abstract keepAlive: boolean;

    constructor(connection: Connection, serial: string) {
        super(connection);
        this.serial = serial;
    }

    /**
     * Executed when {@link preExecute} was successful
     */
    protected abstract postExecute(): T | Promise<T>;
    /**
     * Executes {@link Cmd} on the device
     */
    public async execute(): Promise<T> {
        try {
            await this.initAndValidateReply(
                'host:transport:'.concat(this.serial)
            );
            await this.initAndValidateReply(this.Cmd);
            try {
                return await this.postExecute();
            } catch (err) {
                this.endConnection();
                throw err;
            }
        } finally {
            !this.keepAlive && this.endConnection();
        }
    }
}
