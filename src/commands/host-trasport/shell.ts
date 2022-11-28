import crypto from 'crypto';
import { FailError } from '../..';
import TransportParseAllCommand from '../transport-parse-all-command';

export default class ShellCommand extends TransportParseAllCommand<string> {
    Cmd = 'shell:';
    private uuid = crypto.randomUUID();
    protected parse(value: string): string {
        if (value.includes(this.uuid)) {
            throw new FailError(value.replace(this.uuid, ''));
        }
        return value;
    }

    execute(serial: string, command: string): Promise<string> {
        this.Cmd += [`(${command})`, '||', 'echo', this.escape(this.uuid)].join(
            ' '
        );
        return this.preExecute(serial);
    }
}
