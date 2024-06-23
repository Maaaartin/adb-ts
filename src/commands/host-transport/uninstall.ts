import { Connection } from '../../connection';
import { UninstallOptions } from '../../util';
import PackageCommand from '../abstract/package';

export default class UninstallCommand extends PackageCommand {
    protected Cmd: string;

    constructor(
        connection: Connection,
        serial: string,
        pkg: string,
        options: UninstallOptions | void
    ) {
        super(connection, serial, pkg);
        this.Cmd = ['shell:pm uninstall']
            .concat(options?.keepCache ? '-k' : [])
            .concat(pkg)
            .join(' ');
    }

    protected throwError(code: string): never {
        throw new Error(
            `${this.packageOrPath} could not be uninstalled [${code}]`
        );
    }
}
