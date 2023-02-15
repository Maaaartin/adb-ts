import Command from '../command';

export default class KillCommand extends Command<void> {
    protected autoEnd = true;
    public async execute(): Promise<void> {
        await this.initAndValidateReply('host:kill');
    }
}
