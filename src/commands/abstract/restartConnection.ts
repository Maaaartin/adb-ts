import { Connection } from '../../connection';
import TransportCommand from './transport';

export default abstract class RestartConnection extends TransportCommand<void> {
    private awaiter: Promise<void>;
    constructor(
        connection: Connection,
        serial: string,
        awaiter: Promise<void>
    ) {
        super(connection, serial);
        this.awaiter = awaiter;
    }

    protected async postExecute(): Promise<void> {
        // repeats execution until device is reachable again
        // wait-for not working reliably
        await Promise.all([this.awaiter, this.parser.readAll()]);
    }
}
