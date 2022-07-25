import { Reply, UninstallOptions } from '../..';
import TransportCommand from '../transport';

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
                        return this.parser.readError().then((e) => {
                            throw e;
                        });
                    default:
                        throw this.parser.unexpected(reply, 'OKAY or FAIL');
                }
            });
    }
}
