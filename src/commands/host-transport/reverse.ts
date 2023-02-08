import EmptyCommand from '../empty-command';
import Promise from 'bluebird';

export default class ReverseCommand extends EmptyCommand {
  execute(serial: string, remote: string, local: string): Promise<void> {
    return super.execute(serial, `reverse:forward:${remote};${local}`);
  }
}
