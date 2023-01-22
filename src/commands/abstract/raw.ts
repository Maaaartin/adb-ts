import TransportCommand from './transport';
import { Connection } from '../../connection';

export default abstract class RawCommand extends TransportCommand<Connection> {
    protected autoEnd = false;
    protected postExecute(): Connection {
        return this.connection;
    }
}
