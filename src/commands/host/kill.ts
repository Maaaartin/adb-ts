import Command from '../../command';
import { Reply } from '../..';

export default class KillCommand extends Command {
    execute(): Promise<void> {
        return super.execute('host:kill').then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return;
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
