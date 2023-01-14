import { Connection } from '../../connection';
import DevicesCommand from '../abstract/devices';
import { IAdbDevice } from '../../util';

export default class TrackCommand extends DevicesCommand {
    constructor(connection: Connection) {
        super(connection);
        this.keepAlive = true;
        this.readOnExecute = false;
    }

    execute(): Promise<IAdbDevice[]> {
        return super.execute('host:track-devices-l');
    }
}
