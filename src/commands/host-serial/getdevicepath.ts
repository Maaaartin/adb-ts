import ValueCommand from '../value-command';

export default class GetDevicePathCommand extends ValueCommand {
    execute(serial: string): Promise<string> {
        return this.preExecute(`host-serial:${serial}:get-devpath`);
    }
}
