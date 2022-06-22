import Command from '../../command';
import { Reply, WaitForState, TransportType } from '../..';

export default class WaitForDeviceCommand extends Command {
    execute(tranport: TransportType, state: WaitForState): Promise<void> {
        return super
            .execute(`host:wait-for-${tranport}-${state}`)
            .then((reply) => {
                switch (reply) {
                    case Reply.OKAY:
                        return this.parser_.readAscii(4).then(() => {});
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
