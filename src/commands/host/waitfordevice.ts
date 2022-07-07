import Command from '../../command';
import { Reply, WaitForState, TransportType } from '../..';

export default class WaitForDeviceCommand extends Command {
    execute(tranport: TransportType, state: WaitForState): Promise<void> {
        return this.execute_(`host:wait-for-${tranport}-${state}`).then(
            (reply) => {
                switch (reply) {
                    case Reply.OKAY:
                        return this.parser.readAscii(4).then(() => {});
                    case Reply.FAIL:
                        return this.parser.readError().then((e) => {
                            throw e;
                        });
                    default:
                        throw this.parser.unexpected(reply, 'OKAY or FAIL');
                }
            }
        );
    }
}
