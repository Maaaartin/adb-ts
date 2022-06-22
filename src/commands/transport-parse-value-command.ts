import { Reply } from '..';
import TransportCommand from './tranport';

export default abstract class TransportParseValueCommand extends TransportCommand {
    abstract parse(value: string): any;
    execute(serial: string, ...args: string[]) {
        return super.execute(serial, ...args).then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return this.parser_.readValue().then((value) => {
                        return this.parse(value.toString().trim());
                    });
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
