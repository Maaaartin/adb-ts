import Command from '../lib/commands/command';

export default class CommandMock extends Command<void> {
    protected autoEnd = true;
    public async execute(): Promise<void> {
        return this.initAndValidateReply('mock');
    }
}
