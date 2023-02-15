import { Reply } from '../../util';
import Cmd from './cmd';

export default abstract class ValueCommand<T> extends Cmd<T> {
    protected abstract parse(value: string): T;
    public execute(): Promise<T> {
        return this.initExecute(this.Cmd).then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return this.parser.readValue().then((value) => {
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
