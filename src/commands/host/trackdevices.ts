import DevicesCommand from '../abstract/devices';
import { Connection } from '../../connection';

export default class TrackCommand extends DevicesCommand {
    protected autoEnd = false;
    protected readOnExecute = false;

    constructor(connection: Connection) {
        super(connection, 'host:track-devices-l');
    }
}
