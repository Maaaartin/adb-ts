import Command from '../command';
import { PrimitiveType, Reply } from '..';

export default class ValueCommand extends Command {
    execute(...params: PrimitiveType[]): Promise<any> {
        return this.execute_(...params).then((reply) => {
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
