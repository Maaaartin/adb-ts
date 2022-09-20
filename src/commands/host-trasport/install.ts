import { InstallOptions, Reply } from '../..';
import TransportCommand from '../transport';

export default class InstallCommand extends TransportCommand<void> {
    Cmd = 'shell:pm install ';
    private apk = '';
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
                return this.parser.readAll();
            });
    }
    private intentArgs(options?: InstallOptions): string[] {
        const args: string[] = [];
        if (!options) {
            return args;
        }

        if (options.reinstall) {
            args.push('-r');
            delete options.reinstall;
        }
        if (options.test) {
            args.push('-t');
            delete options.test;
        }
        if (options.internal) {
            args.push('-f');
            delete options.internal;
        }
        if (options.allowDowngrade) {
            args.push('-d');
            delete options.allowDowngrade;
        }
        if (options.grandPermissions) {
            args.push('-g');
            delete options.grandPermissions;
        }

        for (const item of Object.entries(options)) {
            args.push(item[0], this.escape(item[1]));
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
