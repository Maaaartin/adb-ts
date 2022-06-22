import ipRegex from 'ip-regex';
import { Reply } from '../..';
import TransportCommand from '../tranport';

export default class GetIpAddressCommand extends TransportCommand {
    execute(serial: string): Promise<string> {
        return super
            .execute(serial, "shell:ip route | awk '{ print $9 }'")
            .then((reply) => {
                switch (reply) {
                    case Reply.OKAY:
                        return this.parser_.readAll().then((value) => {
                            const valueStr = value.toString().trim();
                            return ipRegex().test(valueStr) ? valueStr : '';
                        });
                    case Reply.FAIL:
                        return this.parser_.readError().then((e) => {
                            throw e;
                        });
                    default:
                        throw this.parser_.unexpected(reply, 'OKAY or FAIL');
                }
            });
    }
}
