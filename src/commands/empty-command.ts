import TransportCommand from './tranport';

export default abstract class EmptyCommand extends TransportCommand<void> {
    protected postExecute(): Promise<void> {
        return this.parser.readAll().then(this.handleReply(void 0));
    }
}
