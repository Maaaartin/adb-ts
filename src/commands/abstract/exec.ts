import crypto from 'crypto';
import { Connection } from '../../connection';
import { AdbExecError, escape } from '../../util';
import TransportCommand from './transport';

export default abstract class ExecCommand<T> extends TransportCommand<T> {
    private readonly uuid = crypto.randomUUID();
    protected keepAlive = false;
    protected abstract cast(value: string): T;
    protected abstract rawCmd: string;

    protected get Cmd(): string {
        return [`shell:(${this.rawCmd})`, '||', 'echo', escape(this.uuid)].join(
            ' '
        );
    }

    protected async postExecute(): Promise<T> {
        const value = (await this.parser.readAll()).toString();
        if (value.includes(this.uuid)) {
            throw new AdbExecError(
                value.replace(this.uuid, '').trim(),
                this.rawCmd
            );
        }
        return this.cast(value);
    }
}
