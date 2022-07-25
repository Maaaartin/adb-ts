import TransportParseAllCommand from '../transport-parse-all-command';

export default class RootCommand extends TransportParseAllCommand<void> {
    protected parse(value: string): void {
        if (!/restarting adbd as root/.test(value)) {
            throw new Error(value);
        }
    }
    Cmd = 'root:';
    execute(serial: string): Promise<void> {
        return this.preExecute(serial);
    }
}
