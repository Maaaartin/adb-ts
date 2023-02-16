import Command from '../command';
import { Reply } from '../../util';

export default class VersionCommand extends Command<number> {
    protected autoEnd = true;
    public async execute(): Promise<number> {
        const reply = await this.initExecute('host:version');
        switch (reply) {
            case Reply.OKAY:
                return this.parser.readValue().then((value) => {
                    return parseInt(value.toString(), 10);
                });
            case Reply.FAIL:
                throw await this.parser.readError();
            default:
                return parseInt(reply, 10);
        }
    }
}
