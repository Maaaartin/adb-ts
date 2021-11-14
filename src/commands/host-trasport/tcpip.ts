import { Reply } from '../..';
import TransportCommand from '../tranport';
import ping from 'ping';

export default class TcpIpCommand extends TransportCommand {
    execute(serial: string, port: number | string, host: string) {
        return super.execute(serial, `tcpip:${port}`).then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return this.parser.readAll().then((value) => {
                        const valueStr = value.toString().trim();
                        if (/restarting in/.test(valueStr)) {
                            // needs to wait until the port is really active
                            return ping.promise
                                .probe(`${host}:${port}`)
                                .then(() => {
                                    return port.toString();
                                });
                        } else {
                            throw new Error(valueStr);
                        }
                    });
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
