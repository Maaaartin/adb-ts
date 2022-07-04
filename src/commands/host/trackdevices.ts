import { IAdbDevice } from '../..';
import DevicesCommand from '../../devices';

export default class TrackCommand extends DevicesCommand {
    execute(): Promise<IAdbDevice[]> {
        return super.execute('host:track-devices-l');
    }
}
