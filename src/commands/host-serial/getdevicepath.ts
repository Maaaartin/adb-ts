import { Connection } from '../../connection';
import ValueCommand from '../abstract/value';

export default class GetDevicePathCommand extends ValueCommand<string> {
    protected autoEnd = true;
    protected Cmd: string;

    constructor(connection: Connection, serial: string) {
        super(connection);
        this.Cmd = `host-serial:${serial}:get-devpath`;
    }

    protected parse(value: string): string {
        return value;
    }
}
