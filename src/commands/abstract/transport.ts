import Command from '../command';
import { ICmd, IPreExecute } from '../../util';

export default abstract class TransportCommand<T>
    extends Command
    implements IPreExecute<T>, ICmd
{
    abstract readonly Cmd: string;
    protected keepAlive = true;
    abstract execute(serial: string, ...args: any[]): Promise<T>;
    /**
     * Executed when {@link preExecute} was successful
     */
    protected abstract postExecute(): Promise<T>;
    /**
     * Executes {@link Cmd} on the device
     */
    preExecute(serial: string): Promise<T> {
        return this.initExecute('host:transport:'.concat(serial))
            .then(
                this.handleReply(() => {
                    return this.initExecute(this.Cmd).then(
                        this.handleReply(() => {
                            return this.postExecute().catch((err) => {
                                this.endConnection();
                                throw err;
                            });
                        })
                    );
                })
            )
            .finally(() => {
                this.endConnection();
            });
    }
}
