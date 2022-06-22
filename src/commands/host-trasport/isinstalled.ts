import { Readable } from 'stream';
import Connection from '../../connection';
import { Reply } from '../..';
import TransportCommand from '../tranport';

export default class IsInstalledCommand extends TransportCommand {
    execute(serial: string, pkg: string | Readable) {
        return super
            .execute(serial, `shell:pm path ${pkg} 2>/dev/null`)
            .then((reply) => {
                switch (reply) {
                    case Reply.OKAY:
                        return this.parser_
                            .readAscii(8)
                            .then((reply) => {
                                switch (reply) {
                                    case 'package:':
                                        return true;
                                    default:
                                        throw this.parser_.unexpected(
                                            reply,
                                            'package:'
                                        );
                                }
                            })
                            .catch((err) => {
                                return false;
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
