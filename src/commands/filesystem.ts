import { VerboseFSoption } from '..';
import ExecCommand from './execCommand';

export default abstract class FileSystemCommand extends ExecCommand<
    string | void
> {
    protected abstract intentArgs(options?: Record<string, any>): string[];
    protected options?: Record<string, any>;

    parse(value: string): string | void {
        if ((this.options as VerboseFSoption | void)?.verbose) {
            return value;
        }
    }

    execute(
        serial: string,
        path: string | string[],
        options?: Record<string, any>
    ): Promise<string | void> {
        const pathArr = Array.isArray(path) ? path : [path];

        this.Cmd = [this.Cmd, ...this.intentArgs(options), ...pathArr].join(
            ' '
        );

        this.options = options;
        return this.preExecute(serial);
    }
}
