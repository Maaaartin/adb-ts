import TransportParseAllCommand from '../transport-parse-all-command';
import { DataMap, findMatches } from '../..';

export default class ListFeaturesCommand extends TransportParseAllCommand<DataMap> {
    Cmd = 'shell:pm list features 2>/dev/null';
    parse(value: string): DataMap {
        return findMatches(value, /^feature:(.*?)(?:=(.*?))?\r?$/gm, true);
    }

    execute(serial: string): Promise<DataMap> {
        return this.preExecute(serial);
    }
}
