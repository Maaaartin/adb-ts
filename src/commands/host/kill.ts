import Command from '../../command';

export default class KillCommand extends Command {
    execute(): Promise<void> {
        return this.execute_('host:kill').then((reply) => {
            return this.handleReply(reply, undefined);
        });
    }
}
