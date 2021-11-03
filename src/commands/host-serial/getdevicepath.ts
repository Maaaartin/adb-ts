import ValueCommand from '../value-command'
import Promise from 'bluebird'

export default class GetDevicePathCommand extends ValueCommand {
    execute(serial: string): Promise<string> {
        return super.execute(`host-serial:${serial}:get-devpath`)
    }
}
