import { findMatches } from '../../util';
import TransportParseAllCommand from '../abstract/transportParseAll';

export default class ListPackagesCommand extends TransportParseAllCommand<
    string[]
> {
    protected Cmd = 'shell:pm list packages 2>/dev/null';
    protected parse(value: string): string[] {
        return findMatches(value, /^package:(.*?)\r?$/gm, 'list');
    }
}
