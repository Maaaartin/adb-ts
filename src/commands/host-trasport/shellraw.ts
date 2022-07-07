import Connection from '../../connection';
import RawCommand from '../raw-command';

export default class ShellRawCommand extends RawCommand {
    execute(serial: string, command: string | string[]): Promise<Connection> {
        if (Array.isArray(command)) {
            command = command.map(this.escape).join(' ');
        }
        return this.preExecute(serial, 'shell:', command);
    }
}
