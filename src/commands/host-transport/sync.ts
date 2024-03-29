import { Sync } from '../../sync';
import TransportCommand from '../abstract/transport';

export default class SyncCommand extends TransportCommand<Sync> {
    protected Cmd = 'sync:';
    protected keepAlive = true;
    protected postExecute(): Sync {
        return new Sync(this.connection);
    }
}
