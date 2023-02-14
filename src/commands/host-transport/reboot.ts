import TransportCommand from '../abstract/transport';

export default class RebootCommand extends TransportCommand<void> {
    protected keepAlive = false;
    protected Cmd = 'reboot:';
    protected postExecute(): void {}
}
