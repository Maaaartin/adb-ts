import { InstallOptions } from '../..';
import TransportCommand from '../transport';

export default class InstallCommand extends TransportCommand<void> {
    Cmd = 'shell:pm install ';
    private apk = '';
    protected end(): Promise<void> {
        return Promise.resolve();
    }
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
                return this.parser.readAll().then(() => super.end());
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
        this.Cmd += this.intentArgs(options)
            .join(' ')
            .concat(this.escapeCompat(this.apk))
            .concat(args ? ` ${args}` : '');
        return this.preExecute(serial);
    }
}
