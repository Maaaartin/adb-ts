import { Reply } from '..'
import TransportCommand from './tranport'
import Promise from 'bluebird'
import Connection from '../connection'

export default class RawCommand extends TransportCommand {
    execute(serial: string, ...params: any[]): Promise<any> {
        return super.execute(serial, ...params).then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return this.connection
                case Reply.FAIL:
                    return this.parser.readError()
                default:
                    return this.parser.unexpected(reply, 'OKAY or FAIL')
            }
        })
    }
}
