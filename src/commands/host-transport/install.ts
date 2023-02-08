import { escapeCompat } from '../../util';
import { InstallOptions } from '../../util';
import TransportCommand from '../abstract/transport';

export default class InstallCommand extends TransportCommand<void> {
    protected Cmd = 'shell:pm install ';
    private apk = '';
    protected keepAlive = false;
    protected postExecute(): Promise<void> {
        return this.parser
            .searchLine(/^(Success|Failure \[(.*?)\])$/)
            .then(([, result, code]) => {
                if (result !== 'Success') {
                    throw new Error(
                        `${this.apk} could not be installed [${code}]`
                    );
                }
            })
            .finally(() => {
                return this.parser.readAll().then(() => this.endConnection());
            });
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

    execute(
        serial: string,
        apk: string,
        options?: InstallOptions,
        args?: string
    ): Promise<void> {
        this.apk = apk;
        this.Cmd += [...this.intentArgs(options), escapeCompat(this.apk), args]
            .filter(Boolean)
            .join(' ');

        return this.preExecute(serial).catch((err) => {
            this.endConnection();
            throw err;
        });
    }
}
