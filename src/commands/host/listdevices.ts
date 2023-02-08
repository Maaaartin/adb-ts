import DevicesCommand from '../abstract/devices';
import { IDevice } from '../../util';

export default class ListDevicesCommand extends DevicesCommand {
    protected autoEnd = true;
    execute(): Promise<IDevice[]> {
        return super.execute('host:devices-l');
    }
}
