import Command from '../../command';
import { encodeData, Reply } from '../..';

export default class HostTransportCommand extends Command {
    execute(serial: string) {
        var encoded;
        encoded = encodeData('host:transport:' + serial);
        this.connection_.write(encoded);
        return this.parser_.readAscii(4).then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return true;
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
