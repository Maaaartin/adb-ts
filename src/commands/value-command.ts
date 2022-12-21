import Command from '../command';
import { IPreExecute, PrimitiveType, Reply } from '../util/types';

export default abstract class ValueCommand
    extends Command
    implements IPreExecute<string>
{
    preExecute(...params: PrimitiveType[]): Promise<string> {
        return this.initExecute(...params).then((reply) => {
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
