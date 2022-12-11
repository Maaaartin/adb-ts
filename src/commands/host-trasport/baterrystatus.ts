import TransportParseAllCommand from '../transport-parse-all-command';
import { DataMap, findMatches } from '../..';

export default class BatteryStatusCommand extends TransportParseAllCommand<DataMap> {
    Cmd = 'shell:dumpsys battery';
    parse(value: string): DataMap {
        return findMatches(value, /^\s+([\s\S]*?): ([\s\S]*?)$/gm, 'map');
    }

    execute(serial: string): Promise<DataMap> {
        return this.preExecute(serial);
    }
}
