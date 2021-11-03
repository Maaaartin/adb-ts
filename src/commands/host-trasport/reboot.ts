import { Reply } from '../..'
import TransportCommand from '../tranport'
import Promise from 'bluebird'

export default class RebootCommand extends TransportCommand {
    execute(serial: string): Promise<void> {
        return super.execute(serial, 'reboot:').then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return this.parser.readAll().return(undefined)
                case Reply.FAIL:
                    return this.parser.readError()
                default:
                    return this.parser.unexpected(reply, 'OKAY or FAIL')
            }
        })
    }
}
