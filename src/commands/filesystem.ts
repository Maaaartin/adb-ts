import { ICmd, VerboseFSoption } from '..';
import TransportCommand from './transport';

export default abstract class FileSystemCommand
    extends TransportCommand<string>
    implements ICmd
{
    protected abstract intentArgs(options?: Record<string, any>): string[];
    protected options?: Record<string, any>;
    abstract Cmd: string;
    private isError(value: string): boolean {
        const split = value.split(':');
        const err = split[split.length - 1];
        return /No/.test(err) || /denied/.test(err);
    }
    postExecute(): Promise<string> {
        return this.parser.readAll().then((value) => {
            const valueStr = value.toString().trim();
            if (this.isError(valueStr)) {
                throw new Error(valueStr);
            }
            if ((this.options as VerboseFSoption | undefined)?.verbose) {
                return valueStr;
            }
            return '';
        });
    }

    execute(
        serial: string,
        path: string | string[],
        options?: Record<string, any>
    ): Promise<string> {
        const pathArr = Array.isArray(path) ? path : [path];
        this.Cmd = [
            'shell:' + this.Cmd,
            ...this.intentArgs(options),
            ...pathArr
        ].join(' ');
        this.options = options;
        return this.preExecute(serial);
    }
}
