import TransportParseAllCommand from '../abstract/transportParseAll';
import { PropertyMap } from '../../util';
import { findMatches } from '../../util';

export default class BatteryStatusCommand extends TransportParseAllCommand<PropertyMap> {
    protected Cmd = 'shell:dumpsys battery';
    protected parse(value: string): PropertyMap {
        return findMatches(value, /^\s+([\s\S]*?): ([\s\S]*?)$/gm, 'map');
    }
}
