import DevicesCommand from '../abstract/devices';
import { IDevice } from '../../util';

export default class TrackCommand extends DevicesCommand {
    protected autoEnd = false;
    protected readOnExecute = false;

    execute(): Promise<IDevice[]> {
        return super.execute('host:track-devices-l');
    }
}
