import { DataMap, findMatches, SettingsMode } from '../..';
import TransportParseAllCommand from '../transport-parse-all-command';

export default class ListSettingsCommand extends TransportParseAllCommand<DataMap> {
    Cmd = 'shell:settings list ';
    parse(value: string): DataMap {
        return findMatches(value, /^([\s\S]*?)=([\s\S]*?)\n/gm, 'map');
    }
    execute(serial: string, mode: SettingsMode): Promise<DataMap> {
        this.Cmd += mode;
        return this.preExecute(serial);
    }
}
