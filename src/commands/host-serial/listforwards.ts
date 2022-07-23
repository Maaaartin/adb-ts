import { ForwardsObject } from '../..';
import ParseCommand from '../parse-command';

export default class ListForwardsCommand extends ParseCommand<
    ForwardsObject[]
> {
    parse(value: string): ForwardsObject[] {
        const line = value.split('\n').filter(Boolean);
        return line.map((item) => {
            const tmp = item.split(/\s+/);
            return {
                serial: tmp[0] || '',
                local: tmp[1] || '',
                remote: tmp[2] || ''
            };
        });
    }

    execute(serial: string): Promise<ForwardsObject[]> {
        return super.execute(`host-serial:${serial}:list-forward`);
    }
}
