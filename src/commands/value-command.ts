import Command from '../command';
import { Reply } from '..';

export default class ValueCommand extends Command {
    execute(...params: any[]) {
        return super.execute(...params).then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return this.parser_.readValue().then((value) => {
                        return value.toString().trim();
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
