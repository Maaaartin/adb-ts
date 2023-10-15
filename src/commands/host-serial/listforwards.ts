import { Connection } from '../../connection';
import { findMatches } from '../../util';
import { ForwardsObject } from '../../util';
import ValueCommand from '../abstract/value';

export default class ListForwardsCommand extends ValueCommand<
    ForwardsObject[]
> {
    protected Cmd: string;
    protected autoEnd = true;

    constructor(connection: Connection, serial: string) {
        super(connection);
        this.Cmd = `host-serial:${serial}:list-forward`;
    }

    protected parse(value: string): ForwardsObject[] {
        return findMatches(value, /([^\s]+)\s([^\s]+)\s([^\s]+)/gm).map(
            ([serial, local, remote]) => ({
                serial,
                local,
                remote
            })
        );
    }
}
