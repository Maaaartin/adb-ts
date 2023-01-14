import { Connection } from '../../connection';
import RawCommand from '../abstract/raw';
import { escape } from '../../util';

export default class ShellRawCommand extends RawCommand {
    Cmd = 'shell:';
    execute(serial: string, command: string | string[]): Promise<Connection> {
        if (Array.isArray(command)) {
            command = command.map((cmd) => escape(cmd)).join(' ');
        }
        this.Cmd += command;
        return this.preExecute(serial).catch((err) => {
            this.connection.end();
            throw err;
        });
    }
}
