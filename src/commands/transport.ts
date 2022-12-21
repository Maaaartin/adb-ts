import Command from '../command';
import { ICmd, IPreExecute } from '../util/types';

export default abstract class TransportCommand<T>
    extends Command
    implements IPreExecute<T>, ICmd
{
    abstract readonly Cmd: string;
    protected keepAlive = true;
    protected abstract postExecute(): Promise<T>;
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
