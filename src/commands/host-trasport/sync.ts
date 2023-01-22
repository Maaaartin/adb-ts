import { Sync } from '../../sync';
import TransportCommand from '../abstract/transport';

export default class SyncCommand extends TransportCommand<Sync> {
    protected Cmd = 'sync:';
    endConnection(): void {}
    protected postExecute(): Sync {
        return new Sync(this.connection);
    }
    execute(serial: string): Promise<Sync> {
        return this.preExecute(serial).catch((err) => {
            super.endConnection();
            throw err;
        });
    }
}
