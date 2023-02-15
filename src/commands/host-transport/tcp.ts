import { Connection } from '../../connection';
import RawCommand from '../abstract/raw';

export default class TcpCommand extends RawCommand {
    protected Cmd: string;

    constructor(
        connection: Connection,
        serial: string,
        port: number,
        host?: string
    ) {
        super(connection, serial);
        this.Cmd = 'tcp:'.concat(
            host ? host.concat(':', String(port)) : String(port)
        );
    }

    public async execute(): Promise<Connection> {
        try {
            return await super.execute();
        } catch (err) {
            this.endConnection();
            throw err;
        }
    }
}
