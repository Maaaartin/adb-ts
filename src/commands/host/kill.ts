import Command from '../../command';

export default class KillCommand extends Command {
    execute(): Promise<void> {
        return this.initExecute('host:kill').then(this.handleReply(undefined));
    }
}
