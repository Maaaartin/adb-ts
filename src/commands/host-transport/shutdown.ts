import { Reply } from '../..';
import TransportCommand from '../transport';
import Promise from 'bluebird';

export default class ShutdownCommand extends TransportCommand {
  execute(serial: string): Promise<void> {
    return super.execute(serial, 'shell:reboot -p').then((reply) => {
      switch (reply) {
        case Reply.OKAY:
          return this.parser.readAll().return(undefined);
        case Reply.FAIL:
          return this.parser.readError();
        default:
          return this.parser.unexpected(reply, 'OKAY or FAIL');
      }
    });
  }
}
