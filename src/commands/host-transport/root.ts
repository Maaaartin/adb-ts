import TransportParseAllCommand from '../abstract/transportParseAll';

export default class RootCommand extends TransportParseAllCommand<void> {
    protected Cmd = 'root:';

    protected parse(value: string): void {
        if (!/restarting adbd as root/.test(value)) {
            throw new Error(value);
        }
    }
}
