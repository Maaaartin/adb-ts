import { Connection } from '../../connection';
import TransportCommand from './transport';

export default abstract class RestartConnection extends TransportCommand<void> {
    private awaiter: Promise<void>;
    constructor(connection: Connection, awaiter: Promise<void>) {
        super(connection);
        this.awaiter = awaiter;
    }

    protected postExecute(): Promise<void> {
        // repeats execution until device is reachable again
        // wait-for not working reliably
        return Promise.all([this.awaiter, this.parser.readAll()]).then(
            () => {}
        );
    }
}
