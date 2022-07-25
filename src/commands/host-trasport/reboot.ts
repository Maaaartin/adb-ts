import TransportCommand from '../transport';

export default class RebootCommand extends TransportCommand<void> {
    Cmd = 'reboot:';
    protected postExecute(): Promise<void> {
        return Promise.resolve();
    }
    execute(serial: string): Promise<void> {
        return this.preExecute(serial);
    }
}
