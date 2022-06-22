import { Reply } from '../..';
import TransportCommand from '../tranport';

export default class RebootCommand extends TransportCommand {
    execute(serial: string): Promise<void> {
        return super.execute(serial, 'reboot:').then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return this.parser_.readAll().then(() => {});
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
