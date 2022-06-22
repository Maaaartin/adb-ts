import Command from '../command';
import { Reply } from '..';

export default class ValueCommand extends Command {
    execute(...params: any[]) {
        return super.execute(...params).then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return this.parser.readValue().then((value) => {
                        return value.toString().trim();
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
