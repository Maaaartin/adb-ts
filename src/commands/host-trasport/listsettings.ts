import { findMatches } from '../../util/functions';
import { PropertyMap, SettingsMode } from '../../util/types';
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
