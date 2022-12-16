import crypto from 'crypto';
import { AdbExecError } from '../';
import TransportCommand from './transport';

export default abstract class ShellCommand<T> extends TransportCommand<T> {
    public abstract Cmd: string;
    private readonly uuid = crypto.randomUUID();
    private rawCmd = '';
    protected abstract cast(value: string): T;

    postExecute(): Promise<T> {
        return this.parser.readAll().then((value) => {
            const valueStr = value.toString();
            if (valueStr.includes(this.uuid)) {
                throw new AdbExecError(
                    valueStr.replace(this.uuid, '').trim(),
                    this.rawCmd
                );
            }
            return this.cast(valueStr);
        });
    }

    preExecute(serial: string): Promise<T> {
        this.rawCmd = this.Cmd;
        this.Cmd = [
            `shell:(${this.Cmd})`,
            '||',
            'echo',
            this.escape(this.uuid)
        ].join(' ');
        console.log(this.Cmd);
        return super.preExecute(serial);
    }
}
