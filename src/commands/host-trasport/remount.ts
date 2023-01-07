import TransportParseAllCommand from '../abstract/transport-parse-all-command';

export default class RemountCommand extends TransportParseAllCommand<void> {
    protected parse(value: string): void {
        if (/Not running as root|inaccessible|not found/.test(value)) {
            throw new Error(value);
        }
    }
    Cmd = 'remount:';
    execute(serial: string): Promise<void> {
        return this.preExecute(serial);
    }
}
