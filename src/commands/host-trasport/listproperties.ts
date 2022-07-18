import { findMatches, PrimitiveDictionary, stringToType } from '../..';
import TransportParseAllCommand from '../transport-parse-all-command';

export default class ListPropertiesCommand extends TransportParseAllCommand<PrimitiveDictionary> {
    get Cmd(): string {
        return 'shell:getprop';
    }
    protected parse(value: string): PrimitiveDictionary {
        return findMatches(
            value,
            /^\[([\s\S]*?)\]: \[([\s\S]*?)\]?$/gm
        ).reduce<PrimitiveDictionary>((acc, [k, v]) => {
            acc[k] = stringToType(v);
            return acc;
        }, {});
    }

    execute(serial: string): Promise<PrimitiveDictionary> {
        return super.preExecute(serial);
    }
}
