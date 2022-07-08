import { ICmd, Reply } from '..';
import TransportCommand from './tranport';

export default abstract class FileSystemCommand
    extends TransportCommand
    implements ICmd
{
    protected abstract intentArgs(options?: Record<string, any>): string[];
    abstract Cmd: string;
    private isError(value: string): boolean {
        const split = value.split(':');
        const err = split[split.length - 1];
        return /No/.test(err) || /denied/.test(err);
    }
    execute(
        serial: string,
        path: string | string[],
        options?: Record<string, any>
    ): Promise<string> {
        const pathArr = Array.isArray(path) ? path : [path];
        return this.initExecute(
            serial,
            'shell:' + this.Cmd,
            ...this.intentArgs(options),
            ...pathArr
        ).then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return this.parser.readAll().then((value) => {
                        const valueStr = value.toString().trim();
                        if (this.isError(valueStr)) {
                            throw new Error(valueStr);
                        } else if (options && options.verbose) {
                            return valueStr;
                        } else {
                            return '';
                        }
                    });
                case Reply.FAIL:
                    return this.parser.readError().then((e) => {
                        throw e;
                    });
                default:
                    throw this.parser.unexpected(reply, 'OKAY or FAIL');
            }
        });
    }
}
