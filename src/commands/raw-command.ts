import TransportCommand from './transport';
import Connection from '../connection';

export default abstract class RawCommand extends TransportCommand<Connection> {
    endConnection(): void {}
    protected postExecute(): Promise<Connection> {
        return Promise.resolve(this.connection);
    }
}
