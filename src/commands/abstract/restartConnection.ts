import { Connection } from '../../connection';
import TransportCommand from './transport';

export default abstract class RestartConnection extends TransportCommand<void> {
    private awaiter: Promise<void>;
    constructor(connection: Connection, awaiter: Promise<void>) {
        super(connection);
        this.awaiter = awaiter;
    }

    private readResponse(): Promise<void> {
        return this.parser.readAll().then((value) => {
            const valueStr = value.toString().trim();
            if (!/restarting in/.test(valueStr)) {
                throw new Error(valueStr || 'No error message');
            }
        });
    }

    protected postExecute(): Promise<void> {
        // repeats execution until device is reachable again
        // wait-for not working reliably
        return Promise.all([this.awaiter, this.readResponse()]).then(() => {});
    }
}
