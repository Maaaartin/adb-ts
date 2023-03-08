import { Connection } from '../../connection';
import { ArgsMapper, NonNullable } from '../../util';
import ExecCommand from './exec';

export default abstract class FileSystemCommand<
    T,
    P extends string | string[]
> extends ExecCommand<void> {
    protected abstract rootCmd: string;
    protected abstract argsMapper: ArgsMapper<T>;
    private path: P;
    private options: T;

    constructor(
        connection: Connection,
        serial: string,
        path: P,
        options: T = {} as T
    ) {
        super(connection, serial);
        this.path = path;
        this.options = options;
    }

    protected get rawCmd(): string {
        const args = Object.entries(this.options as object).reduce<
            (string | string[])[]
        >((acc, [key, val]) => {
            const [key_, val_] = [key as keyof T, val as T[keyof T]];
            if (typeof val_ === 'undefined') {
                return acc;
            }

            const mapper = this.argsMapper[key_];
            if (typeof mapper === 'function') {
                return acc.concat([
                    [mapper(val_ as NonNullable<typeof val_>, this.options)]
                        .flat()
                        .filter(Boolean)
                ]);
            }
            if (val_ !== false) {
                return acc.concat(mapper);
            }

            return acc;
        }, []);

        return [
            this.rootCmd,
            ...args.filter(Boolean).sort().flat(),
            ...[this.path].flat()
        ].join(' ');
    }

    protected cast(): void {
        return;
    }
}
