import { Reply } from '../..'
import TransportCommand from '../tranport'

export default class WaitBootCompleteCommand extends TransportCommand {
    execute(serial: string) {
        return super
            .execute(
                serial,
                'shell:while getprop sys.boot_completed 2>/dev/null; do sleep 1; done'
            )
            .then((reply) => {
                switch (reply) {
                    case Reply.OKAY:
                        return this.parser
                            .searchLine(/^1$/)
                            .finally(() => {
                                return this.parser.end()
                            })
                            .then(() => {
                                return
                            })
                    case Reply.FAIL:
                        return this.parser.readError()
                    default:
                        return this.parser.unexpected(reply, 'OKAY or FAIL')
                }
            })
    }
}
