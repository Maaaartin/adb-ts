import Command from '../command';
import { IAbstractCommand, PrimitiveType, Reply } from '..';

export default abstract class ValueCommand
    extends Command
    implements IAbstractCommand<string>
{
    preExecute(...params: PrimitiveType[]): Promise<string> {
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
