import { Reply } from '..';
import TransportCommand from './tranport';

import Connection from '../connection';

export default class RawCommand extends TransportCommand {
    execute(serial: string, ...params: any[]): Promise<any> {
        return super.execute(serial, ...params).then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return this.connection_;
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
