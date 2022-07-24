import { ReversesObject } from '../..';
import TransportParseValueCommand from '../transport-parse-value-command';

export default class ListReversesCommand extends TransportParseValueCommand<
    ReversesObject[]
> {
    Cmd = 'reverse:list-forward';

    parse(value: string): ReversesObject[] {
        const reverses = [];
        const line = value.toString().split('\n');
        for (const item of line) {
            if (item) {
                const tmp = item.split(/\s+/);
                reverses.push({
                    remote: tmp[1],
                    local: tmp[2]
                });
            }
        }
        return reverses;
    }
    execute(serial: string): Promise<ReversesObject[]> {
        return this.preExecute(serial);
    }
}
