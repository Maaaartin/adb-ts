import Command from '../command';
export default class HostTransportCommand extends Command {
    protected keepAlive = true;
    execute(serial: string): Promise<void> {
        return this.initExecute('host:transport:' + serial)
            .then(this.handleReply(undefined))
            .catch((err) => {
                this.endConnection();
                throw err;
            });
    }
}
