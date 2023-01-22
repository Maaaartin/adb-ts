import TransportCommand from '../abstract/transport';

export default class RebootCommand extends TransportCommand<void> {
    Cmd = 'reboot:';
    protected postExecute(): void {}
    execute(serial: string): Promise<void> {
        return this.preExecute(serial);
    }
}
