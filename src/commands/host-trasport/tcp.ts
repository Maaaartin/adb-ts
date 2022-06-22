import { encodeData, Reply } from '../..';
import TransportCommand from '../tranport';

export default class TcpCommand extends TransportCommand {
    execute(port: number | string, host?: string) {
        const encoded = encodeData('tcp:' + port + (host ? ':' + host : ''));
        this.connection_.write(encoded);
        return this.parser_.readAscii(4).then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return this.connection_;
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
