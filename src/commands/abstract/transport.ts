import { Mixin } from 'ts-mixer';
import Cmd from './cmd';
import PreExecute from './preExecute';

export default abstract class TransportCommand<T> extends Mixin(
    PreExecute,
    Cmd
) {
    protected keepAlive = true;
    abstract execute(serial: string, ...args: any[]): Promise<T>;
    /**
     * Executed when {@link preExecute} was successful
     */
    protected abstract postExecute(): T | Promise<T>;
    /**
     * Executes {@link Cmd} on the device
     */
    preExecute(serial: string): Promise<T> {
        return this.initExecute('host:transport:'.concat(serial))
            .then(
                this.handleReply(() => {
                    return this.initExecute(this.Cmd).then(
                        this.handleReply(() => {
                            return Promise.resolve(this.postExecute()).catch(
                                (err) => {
                                    this.endConnection();
                                    throw err;
                                }
                            );
                        })
                    );
                })
            )
            .finally(() => {
                this.endConnection();
            });
    }
}
