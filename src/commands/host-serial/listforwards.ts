import { ForwardsObject } from '../..';
import ParseCommand from '../parse-command';
import Promise from 'bluebird';

export default class ListForwardsCommand extends ParseCommand {
  parse(value: string): ForwardsObject[] {
    const forwards = [];
    if (!value) return forwards;
    const line = value.split('\n');
    for (const item of line) {
      const tmp = item.split(/\s+/);
      forwards.push({
        serial: tmp[0],
        local: tmp[1],
        remote: tmp[2],
      });
    }
    return forwards;
  }

  execute(serial: string): Promise<ForwardsObject[]> {
    return super.execute(`host-serial:${serial}:list-forward`);
  }
}
