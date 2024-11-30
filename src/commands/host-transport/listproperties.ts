import { findMatches, ListPropertiesMap } from '../../util';
import TransportParseAllCommand from '../abstract/transportParseAll';

const valueParser = (
    type: string | undefined,
    value: string
): string | boolean | number => {
    switch (type) {
        case 'bool':
        case 'int':
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        default:
            return value;
    }
};

export default class ListPropertiesCommand extends TransportParseAllCommand<ListPropertiesMap> {
    protected Cmd = 'shell:getprop -T && getprop';

    protected parse(value: string): ListPropertiesMap {
        const matches = findMatches(
            value,
            /^\[([\s\S]*?)\]: \[([\s\S]*?)\]?$/gm
        ) as [string, string][];
        const typeMap = new Map(matches.slice(0, matches.length / 2));
        return new Map(
            matches
                .slice(matches.length / 2)
                .map(([key, value]) => [
                    key,
                    valueParser(typeMap.get(key), value)
                ])
        );
    }
}
