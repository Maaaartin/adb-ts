import TransportParseAllCommand from '../abstract/transportParseAll';
import { PropertyMap } from '../../util/types';
import { findMatches } from '../../util/functions';

export default class BatteryStatusCommand extends TransportParseAllCommand<PropertyMap> {
    Cmd = 'shell:dumpsys battery';
    parse(value: string): PropertyMap {
        return findMatches(value, /^\s+([\s\S]*?): ([\s\S]*?)$/gm, 'map');
    }

    execute(serial: string): Promise<PropertyMap> {
        return this.preExecute(serial);
    }
}
