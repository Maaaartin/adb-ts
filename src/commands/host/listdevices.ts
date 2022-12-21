import DevicesCommand from '../../devices';
import { IAdbDevice } from '../../util/types';

export default class ListDevicesCommand extends DevicesCommand {
    execute(): Promise<IAdbDevice[]> {
        return super.execute('host:devices-l');
    }
}
