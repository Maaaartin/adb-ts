import Command from '../../command';
import { Reply } from '../..';

export default class VersionCommand extends Command {
    execute() {
        return super.execute('host:version')
            .then((reply) => {
                switch (reply) {
                    case Reply.OKAY:
                        return this.parser.readValue().then((value) => {
                            return parseInt(value.toString(), 10)
                        });
                    case Reply.FAIL:
                        return this.parser.readError();
                    default:
                        return parseInt(reply, 10);
                }
            })
    }
}