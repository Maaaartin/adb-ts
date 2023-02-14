import { Mixin } from 'ts-mixer';
import Cmd from './cmd';
import PreExecute from './preExecute';

export default abstract class TransportCommand<T> extends Mixin(
    PreExecute,
    Cmd
) {
    protected autoEnd = false;
    protected abstract keepAlive: boolean;
    abstract execute(serial: string, ...args: any[]): Promise<T>;
    /**
     * Executed when {@link preExecute} was successful
     */
    protected abstract postExecute(): T | Promise<T>;
    /**
     * Executes {@link Cmd} on the device
     */
    protected async preExecute(serial: string): Promise<T> {
        try {
            await this.initAndValidateReply('host:transport:'.concat(serial));
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
