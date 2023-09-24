import Command from '../command';

export default class KillCommand extends Command<void> {
    protected autoEnd = true;
    public endConnection(): void {
        this.connection.once('error', () => {
            // ignore
        });
        return super.endConnection();
    }
    public async execute(): Promise<void> {
        await this.initAndValidateReply('host:kill');
    }
}
