import TransportCommand from './tranport';
import Connection from '../connection';

export default abstract class RawCommand extends TransportCommand<Connection> {
    protected postExecute(): Promise<Connection> {
        return Promise.resolve(this.connection);
    }
}
