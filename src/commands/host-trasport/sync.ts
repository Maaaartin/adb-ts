import { Reply } from '../..';
import Sync from '../../sync';
import TransportCommand from '../tranport';

export default class SyncCommand extends TransportCommand {
    execute(serial: string) {
        return super.execute(serial, 'sync:').then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return new Sync(this.connection);
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
