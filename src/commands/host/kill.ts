import Command from '../command';

export default class KillCommand extends Command {
    protected autoEnd = true;
    execute(): Promise<void> {
        return this.initExecute('host:kill').then(this.handleReply(undefined));
    }
}
