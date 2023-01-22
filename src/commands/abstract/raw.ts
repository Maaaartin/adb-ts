import TransportCommand from './transport';
import { Connection } from '../../connection';

export default abstract class RawCommand extends TransportCommand<Connection> {
    protected keepAlive = true;
    protected postExecute(): Connection {
        return this.connection;
    }
}
