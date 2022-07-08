import Command from '../command';
import { ICmd, IPostExecute, IPreExecute } from '..';

export default abstract class TransportCommand<T>
    extends Command
    implements IPreExecute<T>, ICmd, IPostExecute<T>
{
    abstract Cmd: string;
    protected keepAlive = true;
    protected abstract postExecute(): Promise<T>;
    preExecute(serial: string): Promise<T> {
        return this.initExecute('host:transport:'.concat(serial)).then(
            this.handleReply(() =>
                this.initExecute(this.Cmd).then(
                    this.handleReply(() =>
                        this.postExecute().finally(() => this.end())
                    )
                )
            )
        );
    }
}
