import { DataMap, findMatches } from '../..';
import TransportParseAllCommand from '../transport-parse-all-command';

export default class ListPropertiesCommand extends TransportParseAllCommand<DataMap> {
    Cmd = 'shell:getprop';

    protected parse(value: string): DataMap {
        return findMatches(value, /^\[([\s\S]*?)\]: \[([\s\S]*?)\]?$/gm, 'map');
    }

    execute(serial: string): Promise<DataMap> {
        return this.preExecute(serial);
    }
}
