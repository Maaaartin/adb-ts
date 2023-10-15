import { findMatches } from '../../util';
import { ReversesObject } from '../../util';
import TransportParseValueCommand from '../abstract/transportParseValue';

export default class ListReversesCommand extends TransportParseValueCommand<
    ReversesObject[]
> {
    protected Cmd = 'reverse:list-forward';

    protected parse(value: string): ReversesObject[] {
        return findMatches(value, /([^\s]+)\s([^\s]+)\s([^\s]+)/gm).map(
            ([host, remote, local]) => ({ host, remote, local })
        );
    }
}
