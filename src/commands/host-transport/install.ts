import { Connection } from '../../connection';
import { escapeCompat } from '../../util';
import { InstallOptions } from '../../util';
import TransportCommand from '../abstract/transport';

export default class InstallCommand extends TransportCommand<void> {
    protected Cmd: string;
    private apk: string;
    protected keepAlive = false;

    constructor(
        connection: Connection,
        serial: string,
        apk: string,
        options?: InstallOptions,
        args?: string
    ) {
        super(connection, serial);
        this.apk = apk;
        this.Cmd = [
            'shell:pm install',
            ...this.intentArgs(options),
            escapeCompat(this.apk),
            args
        ]
            .filter(Boolean)
            .join(' ');
    }

    protected async postExecute(): Promise<void> {
        try {
            const [, result, code] = await this.parser.searchLine(
                /^(Success|Failure \[(.*?)\])$/
            );
            if (result !== 'Success') {
                throw new Error(`${this.apk} could not be installed [${code}]`);
            }
        } finally {
            await this.parser.readAll();
            this.endConnection();
        }
    }
    private intentArgs(options?: InstallOptions): string[] {
        const args: string[] = [];
        if (!options) {
            return args;
        }

        if (options.reinstall) {
            args.push('-r');
        }
        if (options.test) {
            args.push('-t');
        }
        if (options.internal) {
            args.push('-f');
        }
        if (options.allowDowngrade) {
            args.push('-d');
        }
        if (options.grandPermissions) {
            args.push('-g');
        }

        return args;
    }

    public async execute(): Promise<void> {
        try {
            return await super.execute();
        } catch (err) {
            // TODO find better way to handle this
            this.endConnection();
            throw err;
        }
    }
}
