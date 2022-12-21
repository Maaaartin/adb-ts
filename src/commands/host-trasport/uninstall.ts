import { UninstallOptions } from '../../util/types';
import TransportCommand from '../transport';

export default class UninstallCommand extends TransportCommand<void> {
    Cmd = 'shell:pm uninstall';
    protected postExecute(): Promise<void> {
        return this.parser
            .searchLine(/^(Success|Failure.*|.*Unknown package:.*)$/)
            .then(() => {})
            .finally(() => {
                return this.parser.readAll();
            });
    }
    execute(
        serial: string,
        pkg: string,
        options?: UninstallOptions
    ): Promise<void> {
        this.Cmd = [this.Cmd]
            .concat(options?.keepCache ? '-k' : [])
            .concat(pkg)
            .join(' ');

        return this.preExecute(serial);
    }
}
