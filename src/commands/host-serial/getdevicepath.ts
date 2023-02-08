import ValueCommand from '../abstract/value';

export default class GetDevicePathCommand extends ValueCommand<string> {
    protected autoEnd = true;
    protected parse(value: string): string {
        return value;
    }
    execute(serial: string): Promise<string> {
        return this.preExecute(`host-serial:${serial}:get-devpath`);
    }
}
