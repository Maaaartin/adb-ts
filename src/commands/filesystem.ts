import ExecCommand from './execCommand';

export default abstract class FileSystemCommand extends ExecCommand<void> {
    protected abstract intentArgs(options?: Record<string, any>): string[];
    protected options?: Record<string, any>;

    cast(): void {}

    execute(
        serial: string,
        path: string | string[],
        options?: Record<string, any>
    ): Promise<void> {
        const pathArr = Array.isArray(path) ? path : [path];

        this.Cmd = [this.Cmd, ...this.intentArgs(options), ...pathArr].join(
            ' '
        );

        this.options = options;
        return this.preExecute(serial);
    }
}
