import { Connection } from '../../connection';
import RawCommand from '../abstract/raw';
import { escape } from '../../util';

export default class ShellRawCommand extends RawCommand {
    protected Cmd: string;

    constructor(
        connection: Connection,
        serial: string,
        command: string | string[]
    ) {
        super(connection, serial);
        this.Cmd = ['shell:'].concat([command].flat().map(escape)).join(' ');
    }

    public async execute(): Promise<Connection> {
        try {
            return await super.execute();
        } catch (err) {
            this.endConnection();
            throw err;
        }
    }
}
