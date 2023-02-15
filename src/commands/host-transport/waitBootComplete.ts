import TransportCommand from '../abstract/transport';

export default class WaitBootCompleteCommand extends TransportCommand<void> {
    protected keepAlive = true;
    protected Cmd =
        'shell:while getprop sys.boot_completed 2>/dev/null; do sleep 1; done';
    protected async postExecute(): Promise<void> {
        await this.parser.searchLine(/^1$/);
    }
}
