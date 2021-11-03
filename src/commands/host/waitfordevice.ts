import Command from '../../command';
import { Reply, WaitForState, TransportType } from '../..';
import Promise from 'bluebird';

export default class WaitForDeviceCommand extends Command {
    execute(tranport: TransportType, state: WaitForState): Promise<void> {
        return super
            .execute(`host:wait-for-${tranport}-${state}`)
            .then((reply) => {
                switch (reply) {
                    case Reply.OKAY:
                        return this.parser.readAscii(4).return(undefined);
                    case Reply.FAIL:
                        return this.parser.readError();
                    default:
                        return this.parser.unexpected(reply, 'OKAY or FAIL');
                }
            });
    }
}
