import Command from '../../command';

export default class KillCommand extends Command {
    execute(): Promise<void> {
        return this.execute_('host:kill').then(this.handleReply(undefined));
    }
}
