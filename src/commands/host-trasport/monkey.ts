import { Reply } from '../..';
import Connection from '../../connection';

import TransportCommand from '../transport';

export default class MonkeyCommand extends TransportCommand {
    execute(serial: string, port: number | string): Promise<Connection> {
        return super
            .execute(
                serial,
                `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port ${port} -v`
            )
            .then((reply) => {
                switch (reply) {
                    case Reply.OKAY:
                        return new Promise((resolve, reject) => {
                            let timeout: NodeJS.Timeout;
                            const resolvePromise = () => {
                                clearTimeout(timeout);
                                resolve(this.connection);
                            };
                            this.parser
                                .searchLine(/^:Monkey:/)
                                .then(resolvePromise)
                                .catch(reject);
                            timeout = setTimeout(resolvePromise, 1000);
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
