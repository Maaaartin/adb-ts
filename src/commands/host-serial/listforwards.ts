import { ForwardsObject } from '../..';
import ParseCommand from '../parse-command';
import Promise from 'bluebird';

export default class ListForwardsCommand extends ParseCommand {
    parse(value: string): ForwardsObject[] {
        if (!value) {
            return [];
        } else {
            const line = value.split('\n');
            return line.map((item) => {
                const tmp = item.split(/\s+/);
                return {
                    serial: tmp[0] || '',
                    local: tmp[1] || '',
                    remote: tmp[2] || ''
                };
            });
        }
    }

    execute(serial: string): Promise<ForwardsObject[]> {
        return super.execute(`host-serial:${serial}:list-forward`);
    }
}
