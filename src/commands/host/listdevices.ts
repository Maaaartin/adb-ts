import DevicesCommand from '../abstract/devices';
import { IAdbDevice } from '../../util';

export default class ListDevicesCommand extends DevicesCommand {
    execute(): Promise<IAdbDevice[]> {
        return super.execute('host:devices-l');
    }
}
