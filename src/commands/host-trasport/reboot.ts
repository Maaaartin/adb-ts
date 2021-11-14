import { Reply } from '../..';
import TransportCommand from '../tranport';

export default class RebootCommand extends TransportCommand {
    execute(serial: string): Promise<void> {
        return super.execute(serial, 'reboot:').then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return this.parser.readAll().then(() => {});
                case Reply.FAIL:
                    return this.parser.readError().then((e) => {
                        throw e;
                    });
                default:
                    throw this.parser.unexpected(reply, 'OKAY or FAIL');
            }
        });
    }
}
