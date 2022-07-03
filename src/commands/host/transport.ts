import Command from '../../command';

export default class HostTransportCommand extends Command {
    execute(serial: string): Promise<void> {
        return super.execute('host:transport:' + serial).then(() => {});
    }
}
