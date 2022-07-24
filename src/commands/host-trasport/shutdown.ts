import TransportCommand from '../tranport';

export default class ShutdownCommand extends TransportCommand<void> {
    Cmd = 'shell:reboot -p';
    protected postExecute(): Promise<void> {
        return Promise.resolve();
    }
    execute(serial: string): Promise<void> {
        return this.preExecute(serial);
    }
}
