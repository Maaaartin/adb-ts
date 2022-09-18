import { UnexpectedDataError } from '../..';
import TransportCommand from '../transport';

export default class ClearCommand extends TransportCommand<void> {
    Cmd = 'shell:pm clear ';
    private pkg = '';
    protected postExecute(): Promise<void> {
        return this.parser
            .searchLine(/^(Success|Failed)$/, false)
            .then(([result]) => {
                if (result !== 'Success') {
                    throw new Error(
                        `Package '${this.pkg}' could not be cleared`
                    );
                }
            });
    }
    execute(serial: string, pkg: string): Promise<void> {
        this.pkg = pkg;
        this.Cmd += pkg;
        return this.preExecute(serial);
    }
}
