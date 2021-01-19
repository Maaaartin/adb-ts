import { Reply } from '..';
import TransportCommand from './tranport';
import Promise from 'bluebird';

export default class EmptyCommand extends TransportCommand {
    execute(serial: string, ...params: any[]): Promise<void> {
        return super.execute(serial, ...params)
            .then((reply) => {
                switch (reply) {
                    case Reply.OKAY:
                        return;
                    case Reply.FAIL:
                        return this.parser.readError();
                    default:
                        return this.parser.unexpected(reply, 'OKAY or FAIL');
                }
            });
    }
}