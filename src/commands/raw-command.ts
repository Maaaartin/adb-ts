import TransportCommand from './tranport';
import Connection from '../connection';

export default abstract class RawCommand extends TransportCommand<Connection> {
    protected finalize(): Promise<void> {
        return super.end();
    }
    protected end(): Promise<void> {
        return Promise.resolve();
    }
    protected postExecute(): Promise<Connection> {
        return Promise.resolve(this.connection);
    }
}
