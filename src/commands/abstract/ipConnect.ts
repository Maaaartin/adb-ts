import { Connection } from '../../connection';
import Command from '../command';

export default abstract class IpConnect extends Command<string> {
    protected abstract Validator: RegExp;
    protected autoEnd = false;
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

    public async execute(): Promise<string> {
        try {
            await this.initAndValidateReply(
                `${this.command}:${this.host}:${this.port}`
            );
            const value = (await this.parser.readValue()).toString().trim();
            if (this.Validator.test(value)) {
                return `${this.host}:${this.port}`;
            }
            throw new Error(value);
        } finally {
            this.endConnection();
        }
    }
}
