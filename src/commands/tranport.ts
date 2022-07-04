import Command from '../command';
import { Reply } from '..';

export default class TransportCommand extends Command {
    execute(serial: string, ...args: any[]): Promise<any> {
        return super
            .execute_('host:transport:'.concat(serial))
            .then((reply: string) => {
                switch (reply) {
                    case Reply.OKAY:
                        return super.execute_(...args);
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
