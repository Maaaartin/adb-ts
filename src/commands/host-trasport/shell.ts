import crypto from 'crypto';
import { ShellExecError } from '../..';
import TransportCommand from '../transport';

export default class ShellCommand extends TransportCommand<string> {
    Cmd = 'shell:';
    private readonly uuid = crypto.randomUUID();
    private command = '';

    protected postExecute(): Promise<string> {
        return this.parser.readAll().then((value) => {
            const valueStr = value.toString();
            if (valueStr.includes(this.uuid)) {
                throw new ShellExecError(
                    valueStr.replace(this.uuid, '').trim(),
                    this.command
                );
            }
            return valueStr;
        });
    }

    execute(serial: string, command: string): Promise<string> {
        this.command = command;
        this.Cmd += [`(${command})`, '||', 'echo', this.escape(this.uuid)].join(
            ' '
        );
        return this.preExecute(serial);
    }
}
