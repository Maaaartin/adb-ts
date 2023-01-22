import TransportCommand from '../abstract/transport';

export default class ShutdownCommand extends TransportCommand<void> {
    Cmd = 'shell:reboot -p';
    protected postExecute(): void {}
    execute(serial: string): Promise<void> {
        return this.preExecute(serial);
    }
}
