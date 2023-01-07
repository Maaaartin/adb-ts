import TransportParseAllCommand from '../abstract/transport-parse-all-command';
import { PropertyMap } from '../../util/types';
import { findMatches } from '../../util/functions';

export default class ListFeaturesCommand extends TransportParseAllCommand<PropertyMap> {
    Cmd = 'shell:pm list features 2>/dev/null';
    parse(value: string): PropertyMap {
        return findMatches(value, /^feature:(.*?)(?:=(.*?))?\r?$/gm, 'map');
    }

    execute(serial: string): Promise<PropertyMap> {
        return this.preExecute(serial);
    }
}
