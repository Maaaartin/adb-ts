import { Connection } from '../../connection';
import { ArgsMapper, NonNullable } from '../../util';
import ExecCommand from './exec';

export default abstract class FileSystemCommand<T> extends ExecCommand<void> {
    protected rawCmd: string;
    // protected abstract intentArgs(options?: object): string[];

    constructor(
        connection: Connection,
        serial: string,
        cmd: string,
        path: string | string[],
        argsMapper: ArgsMapper<T>,
        options: T = {} as T
    ) {
        super(connection, serial);
        const args = Object.entries(options as object).reduce<
            (string | string[])[]
        >((acc, [key, val]) => {
            const key_ = key as keyof T;

            const mapper = argsMapper[key_];
            if (typeof mapper === 'function' && typeof val !== 'undefined') {
                const t = options[key_];
                acc.push(mapper(options[key_] as NonNullable<typeof t>));
            } else if (
                typeof mapper === 'string' &&
                typeof val !== 'undefined' &&
                val !== false
            ) {
                acc.push(mapper);
            }

            return acc;
        }, []);

        this.rawCmd = [
            cmd,
            ...args.filter(Boolean).sort().flat(),
            ...[path].flat()
        ].join(' ');
    }

    protected cast(): void {
        return;
    }
}
