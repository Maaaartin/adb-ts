import { Reply } from '..';
import TransportCommand from './tranport';

export default abstract class TransportParseAllCommand extends TransportCommand {
    protected abstract parse(value: string): any;
    execute(serial: string, ...args: any[]) {
        return super.execute(serial, ...args).then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return this.parser.readAll().then((value) => {
                        return this.parse(value.toString().trim());
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
