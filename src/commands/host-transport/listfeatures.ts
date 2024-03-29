import TransportParseAllCommand from '../abstract/transportParseAll';
import { PropertyMap } from '../../util';
import { findMatches } from '../../util';

export default class ListFeaturesCommand extends TransportParseAllCommand<PropertyMap> {
    protected Cmd = 'shell:pm list features 2>/dev/null';
    protected parse(value: string): PropertyMap {
        return findMatches(value, /^feature:(.*?)(?:=(.*?))?\r?$/gm, 'map');
    }
}
