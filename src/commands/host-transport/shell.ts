import { Connection } from '../../connection';
import ExecCommand from '../abstract/exec';

export default class ShellCommand extends ExecCommand<string> {
    protected rawCmd: string;

    constructor(connection: Connection, serial: string, command: string) {
        super(connection, serial);
        this.rawCmd = command;
    }

    protected cast(value: string): string {
        return value;
    }
}
