import Promise from 'bluebird';
import ipRegex from 'ip-regex';
import { Reply } from '../..';
import TransportCommand from '../transport';

export default class GetIpAddressCommand extends TransportCommand {
  execute(serial: string): Promise<string | null> {
    return super
      .execute(serial, "shell:ip route | awk '{ print $9 }'")
      .then((reply) => {
        switch (reply) {
          case Reply.OKAY:
            return this.parser.readAll().then((value) => {
              const valueStr = value.toString().trim();
              return ipRegex().test(valueStr) ? valueStr : null;
            });
          case Reply.FAIL:
            return this.parser.readError();
          default:
            return this.parser.unexpected(reply, 'OKAY or FAIL');
        }
      });
  }
}
