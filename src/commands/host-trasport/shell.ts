import crypto from 'crypto';
import { FailError } from '../..';
import TransportCommand from '../transport';

export default class ShellCommand extends TransportCommand<string> {
    Cmd = 'shell:';
    private uuid = crypto.randomUUID();

    protected postExecute(): Promise<string> {
        return this.parser.readAll().then((value) => {
            const valueStr = value.toString();
            if (valueStr.includes(this.uuid)) {
                throw new FailError(valueStr.replace(this.uuid, ''));
            }
            return valueStr;
        });
    }

    execute(serial: string, command: string): Promise<string> {
        this.Cmd += [`(${command})`, '||', 'echo', this.escape(this.uuid)].join(
            ' '
        );
        return this.preExecute(serial);
    }
}
