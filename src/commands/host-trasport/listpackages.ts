import { findMatches } from '../..';
import TransportParseAllCommand from '../transport-parse-all-command';

export default class ListPackagesCommand extends TransportParseAllCommand<
    string[]
> {
    Cmd = 'shell:pm list packages 2>/dev/null';
    protected parse(value: string): string[] {
        return [...findMatches(value, /^package:(.*?)\r?$/gm, 'set')];
    }

    execute(serial: string): Promise<string[]> {
        return this.preExecute(serial);
    }
}
