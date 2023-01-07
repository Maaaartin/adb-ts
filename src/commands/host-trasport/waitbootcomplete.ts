import TransportCommand from '../abstract/transport';

export default class WaitBootCompleteCommand extends TransportCommand<void> {
    Cmd =
        'shell:while getprop sys.boot_completed 2>/dev/null; do sleep 1; done';
    protected postExecute(): Promise<void> {
        return this.parser.searchLine(/^1$/).then(() => {});
    }

    execute(serial: string): Promise<void> {
        return this.preExecute(serial);
    }
}
