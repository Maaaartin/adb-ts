import TransportParseAllCommand from '../abstract/transportParseAll';

export default class RemountCommand extends TransportParseAllCommand<void> {
    protected Cmd = 'remount:';
    protected parse(value: string): void {
        if (/Not running as root|inaccessible|not found/.test(value)) {
            throw new Error(value);
        }
    }
}
