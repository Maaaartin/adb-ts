import { findMatches } from '../../util';
import { ForwardsObject } from '../../util';
import ValueCommand from '../abstract/value';

export default class ListForwardsCommand extends ValueCommand<
    ForwardsObject[]
> {
    parse(value: string): ForwardsObject[] {
        return findMatches(value, /([^\s]+)\s([^\s]+)\s([^\s]+)/gm).map(
            ([serial, local, remote]) => ({
                serial,
                local,
                remote
            })
        );
    }

    execute(serial: string): Promise<ForwardsObject[]> {
        return this.preExecute(`host-serial:${serial}:list-forward`);
    }
}
