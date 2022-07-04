import { Reply } from '../..';
import Command from '../../command';

export default class HostTransportCommand extends Command {
    execute(serial: string): Promise<void> {
        return super.execute_('host:transport:' + serial).then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return;
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
