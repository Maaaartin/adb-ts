import { Connection } from '../../connection';
import RawCommand from '../abstract/raw';
import { escape } from '../../util';

export default class ShellRawCommand extends RawCommand {
    protected Cmd = 'shell:';
    execute(serial: string, command: string | string[]): Promise<Connection> {
        this.Cmd += [command].flat().map(escape).join(' ');
        return this.preExecute(serial).catch((err) => {
            this.connection.end();
            throw err;
        });
    }
}
