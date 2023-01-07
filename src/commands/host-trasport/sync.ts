import { Sync } from '../../sync';
import TransportCommand from '../abstract/transport';

export default class SyncCommand extends TransportCommand<Sync> {
    Cmd = 'sync:';
    endConnection(): void {}
    protected postExecute(): Promise<Sync> {
        return Promise.resolve(new Sync(this.connection));
    }
    execute(serial: string): Promise<Sync> {
        return this.preExecute(serial).catch((err) => {
            super.endConnection();
            throw err;
        });
    }
}
