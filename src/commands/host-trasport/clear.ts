import { Reply } from '../..';
import TransportCommand from '../tranport';

export default class ClearCommand extends TransportCommand {
    execute(serial: string, pkg: string) {
        return super.execute(serial, `shell:pm clear ${pkg}`).then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return this.parser
                        .searchLine(/^(Success|Failed)$/)
                        .finally(() => {
                            return this.parser.end();
                        })
                        .then((result) => {
                            switch (result[0]) {
                                case 'Success':
                                    return;
                                case 'Failed':
                                    throw new Error(
                                        "Package '" +
                                            pkg +
                                            "' could not be cleared"
                                    );
                            }
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
