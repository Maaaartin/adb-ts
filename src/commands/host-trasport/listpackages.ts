import { findMatches } from '../../util';
import TransportParseAllCommand from '../abstract/transportParseAll';

export default class ListPackagesCommand extends TransportParseAllCommand<
    string[]
> {
    Cmd = 'shell:pm list packages 2>/dev/null';
    protected parse(value: string): string[] {
        return findMatches(value, /^package:(.*?)\r?$/gm, 'list');
    }

    execute(serial: string): Promise<string[]> {
        return this.preExecute(serial);
    }
}
