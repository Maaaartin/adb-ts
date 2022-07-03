import { Reply } from '../..';
import Command from '../../command';

export default class HostTransportCommand extends Command {
    execute(serial: string) {
        return super.execute('host:transport:' + serial).then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return true;
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
