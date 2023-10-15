import DevicesCommand from '../abstract/devices';
import { Connection } from '../../connection';

export default class ListDevicesCommand extends DevicesCommand {
    protected autoEnd = true;
    protected readOnExecute = true;
    constructor(connection: Connection) {
        super(connection, 'host:devices-l');
    }
}
