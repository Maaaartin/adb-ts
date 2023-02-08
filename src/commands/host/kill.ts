import Command from '../../command';
import { Reply } from '../..';
import Promise from 'bluebird';

export default class KillCommand extends Command {
  execute(): Promise<void> {
    return super.execute('host:kill').then((reply) => {
      switch (reply) {
        case Reply.OKAY:
          return;
        case Reply.FAIL:
          return this.parser.readError();
        default:
          return this.parser.unexpected(reply, 'OKAY or FAIL');
      }
    });
  }
}
