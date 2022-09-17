import { Reply } from '../..';
import Sync from '../../sync';
import TransportCommand from '../transport';

export default class SyncCommand extends TransportCommand<Sync> {
    Cmd = 'sync:';
    protected postExecute(): Promise<Sync> {
        return Promise.resolve(new Sync(this.connection));
    }
    execute(serial: string): Promise<Sync> {
        return this.preExecute(serial).then();
    }
}
