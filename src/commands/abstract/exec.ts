import crypto from 'crypto';
import { AdbExecError, escape } from '../../util';
import TransportCommand from './transport';

export default abstract class ExecCommand<T> extends TransportCommand<T> {
    private readonly uuid = crypto.randomUUID();
    private rawCmd = '';
    protected keepAlive = false;
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

    protected preExecute(serial: string): Promise<T> {
        this.rawCmd = this.Cmd;
        this.Cmd = [
            `shell:(${this.Cmd})`,
            '||',
            'echo',
            escape(this.uuid)
        ].join(' ');
        return super.preExecute(serial);
    }
}
