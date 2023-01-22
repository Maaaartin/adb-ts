import { PrimitiveType, Reply } from '../../util';
import PreExecute from './preExecute';

export default abstract class ValueCommand<T> extends PreExecute<T> {
    protected abstract parse(value: string): T;
    protected preExecute(...params: PrimitiveType[]): Promise<T> {
        return this.initExecute(...params).then((reply) => {
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
