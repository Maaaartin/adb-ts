import { Reply } from '../..';
import Command from '../../command';

// TODO replace with transport?
export default class HostTransportCommand extends Command {
    protected keepAlive = true;
    execute(serial: string): Promise<void> {
        return this.initExecute('host:transport:' + serial).then((reply) => {
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
