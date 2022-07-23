import { findMatches, ForwardsObject } from '../..';
import ParseCommand from '../parse-command';

export default class ListForwardsCommand extends ParseCommand<
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
        return super.execute(`host-serial:${serial}:list-forward`);
    }
}
