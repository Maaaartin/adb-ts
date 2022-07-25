import { encodeData, Reply } from '../..';
import TransportCommand from '../transport';

export default class TcpCommand extends TransportCommand {
    execute(port: number | string, host?: string) {
        const encoded = encodeData('tcp:' + port + (host ? ':' + host : ''));
        this.connection.write(encoded);
        return this.parser.readAscii(4).then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return this.connection;
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
