import { PropertyMap, findMatches, SettingsMode } from '../..';
import TransportParseAllCommand from '../transport-parse-all-command';

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
