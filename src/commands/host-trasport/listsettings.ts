import { findMatches } from '../../util';
import { PropertyMap, SettingsMode } from '../../util';
import TransportParseAllCommand from '../abstract/transportParseAll';

export default class ListSettingsCommand extends TransportParseAllCommand<PropertyMap> {
    Cmd = 'shell:settings list ';

    parse(value: string): PropertyMap {
        return findMatches(value, /^([\s\S]*?)=([\s\S]*?)$/gm, 'map');
    }

    execute(serial: string, mode: SettingsMode): Promise<PropertyMap> {
        this.Cmd += mode;
        return this.preExecute(serial);
    }
}
