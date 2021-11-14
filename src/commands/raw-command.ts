import { Reply } from '..';
import TransportCommand from './tranport';

import Connection from '../connection';

export default class RawCommand extends TransportCommand {
    execute(serial: string, ...params: any[]): Promise<any> {
        return super.execute(serial, ...params).then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return this.connection;
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
