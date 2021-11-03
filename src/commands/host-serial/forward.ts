import Command from '../../command';
import { Reply } from '../..';
import Promise from 'bluebird';

export default class ForwardCommand extends Command {
    execute(serial: string, local: string, remote: string): Promise<void> {
        return super
            .execute(`host-serial:${serial}:forward:${local};${remote}`)
            .then((reply) => {
                switch (reply) {
                    case Reply.OKAY:
                        return this.parser.readAscii(4).then((reply) => {
                            switch (reply) {
                                case Reply.OKAY:
                                    return;
                                case Reply.FAIL:
                                    return this.parser.readError();
                                default:
                                    return this.parser.unexpected(
                                        reply,
                                        'OKAY or FAIL'
                                    );
                            }
                        });
                    case Reply.FAIL:
                        return this.parser.readError();
                    default:
                        return this.parser.unexpected(reply, 'OKAY or FAIL');
                }
            });
    }
}
