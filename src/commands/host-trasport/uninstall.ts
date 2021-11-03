import { Reply, UninstallOptions } from '../..';
import TransportCommand from '../tranport';

export default class UninstallCommand extends TransportCommand {
    execute(serial: string, pkg: string, options?: UninstallOptions) {
        return super
            .execute(
                serial,
                'shell:pm uninstall',
                options?.keepCache ? '-k' : '',
                pkg
            )
            .then((reply) => {
                switch (reply) {
                    case Reply.OKAY:
                        return this.parser
                            .searchLine(
                                /^(Success|Failure.*|.*Unknown package:.*)$/
                            )
                            .then(() => {
                                return;
                            })
                            .finally(() => {
                                return this.parser.readAll();
                            });
                    case Reply.FAIL:
                        return this.parser.readError();
                    default:
                        return this.parser.unexpected(reply, 'OKAY or FAIL');
                }
            });
    }
}
