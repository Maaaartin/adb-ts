import { Connection } from '../../connection';
import Command from '../command';
import Cmd from './cmd';

export default abstract class IpConnect extends Command<string> {
    protected abstract Validator: RegExp;
    protected autoEnd = true;
    private command: string;
    private host: string;
    private port: number;

    constructor(
        connection: Connection,
        command: string,
        host: string,
        port: number
    ) {
        super(connection);
        this.command = command;
        this.host = host;
        this.port = port;
    }

    public execute(): Promise<string> {
        return this.initExecute(`${this.command}:${this.host}:${this.port}`)
            .then(
                this.handleReply(() => {
                    return this.parser.readValue().then((value) => {
                        const valueStr = value.toString().trim();
                        if (this.Validator.test(valueStr)) {
                            return `${this.host}:${this.port}`;
                        }
                        throw new Error(valueStr);
                    });
                })
            )
            .finally(() => {
                this.endConnection();
            });
    }
}
