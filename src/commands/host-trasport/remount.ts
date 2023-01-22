import TransportParseAllCommand from '../abstract/transportParseAll';

export default class RemountCommand extends TransportParseAllCommand<void> {
    protected parse(value: string): void {
        if (/Not running as root|inaccessible|not found/.test(value)) {
            throw new Error(value);
        }
    }
    protected Cmd = 'remount:';
    execute(serial: string): Promise<void> {
        return this.preExecute(serial);
    }
}
