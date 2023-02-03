import TransportParseAllCommand from '../abstract/transportParseAll';

export default class RootCommand extends TransportParseAllCommand<void> {
    protected parse(value: string): void {
        if (!/restarting adbd as root/.test(value)) {
            throw new Error(value);
        }
    }
    protected Cmd = 'root:';
    execute(serial: string): Promise<void> {
        return this.preExecute(serial);
    }
}
