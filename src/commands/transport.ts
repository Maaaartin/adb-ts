import Promise from 'bluebird';
import Command from '../command';
import { Reply } from '..';

export default class TransportCommand extends Command {
  execute(serial: string, ...args: any[]): Promise<any> {
    return super
      .execute('host:transport:'.concat(serial))
      .then((reply: string) => {
        switch (reply) {
          case Reply.OKAY:
            return super.execute(...args);
          case Reply.FAIL:
            return this.parser.readError();
          default:
            return this.parser.unexpected(reply, 'OKAY or FAIL');
        }
      });
  }
}
