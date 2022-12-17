import TransportParseAllCommand from '../transport-parse-all-command';
import { PropertyMap, findMatches } from '../..';

export default class ListFeaturesCommand extends TransportParseAllCommand<PropertyMap> {
    Cmd = 'shell:pm list features 2>/dev/null';
    parse(value: string): PropertyMap {
        return findMatches(value, /^feature:(.*?)(?:=(.*?))?\r?$/gm, 'map');
    }

    execute(serial: string): Promise<PropertyMap> {
        return this.preExecute(serial);
    }
}
