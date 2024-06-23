import { Connection } from '../../connection';
import { escapeCompat } from '../../util';
import { InstallOptions } from '../../util';
import PackageCommand from '../abstract/package';

export default class InstallCommand extends PackageCommand {
    protected Cmd: string;
    constructor(
        connection: Connection,
        serial: string,
        apk: string,
        options: InstallOptions | void,
        args: string | void
    ) {
        super(connection, serial, apk);
        this.Cmd = [
            'shell:pm install',
            ...this.intentArgs(options),
            escapeCompat(apk),
            args
        ]
            .filter(Boolean)
            .join(' ');
    }

    protected throwError(code: string): never {
        throw new Error(
            `${this.packageOrPath} could not be installed [${code}]`
        );
    }

    private intentArgs(options: InstallOptions | void): string[] {
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
}
