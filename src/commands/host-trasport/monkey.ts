import { Reply } from '../..';
import Promise from 'bluebird';
import TransportCommand from '../tranport';

export default class MonkeyCommand extends TransportCommand {
    execute(serial: string, port: number | string) {
        return super.execute(serial, `shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port ${port} -v`)
            .then((reply) => {
                switch (reply) {
                    case Reply.OKAY:
                        return this.parser.searchLine(/^:Monkey:/).timeout(1000).then(() => this.connection)
                            .catch(Promise.TimeoutError, () => this.connection);
                    case Reply.FAIL:
                        return this.parser.readError();
                    default:
                        return this.parser.unexpected(reply, 'OKAY or FAIL');
                }
            });
    }
}