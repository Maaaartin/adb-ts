import { IAdbDevice } from '../..';
import DevicesCommand from '../../devices';

export default class ListDevicesCommand extends DevicesCommand {
    execute(): Promise<IAdbDevice[]> {
        return super.execute('host:devices-l');
    }
}
