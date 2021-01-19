import RawCommand from '../raw-command';

export default class ShellRawCommand extends RawCommand {
    execute(serial: string, command: string | string[]) {
        if (Array.isArray(command)) {
            command = command.map(this.escape).join(' ');
        }
        return super.execute(serial, 'shell:', command);
    }
}