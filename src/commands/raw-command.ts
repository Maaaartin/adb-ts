import { IPreExecute, Reply } from '..';
import TransportCommand from './tranport';

import Connection from '../connection';

export default abstract class RawCommand
    extends TransportCommand
    implements IPreExecute<Connection>
{
    preExecute(serial: string, ...params: any[]): Promise<Connection> {
        return super.initExecute(serial, ...params).then((reply) => {
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
