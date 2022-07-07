import ValueCommand from '../value-command';

export default class GetDevicePathCommand extends ValueCommand {
    execute(serial: string): Promise<string> {
        return super.preExecute(`host-serial:${serial}:get-devpath`);
    }
}
