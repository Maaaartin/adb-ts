import { Connection } from '../../connection';
import { ArgsMapper, NonNullable, ObjectEntries } from '../../util';
import ExecCommand from './exec';

export default abstract class FileSystemCommand<
    T extends object,
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
        const args = (Object.entries(this.options) as ObjectEntries<T>).reduce<
            (string | string[])[]
        >((acc, [key, val]) => {
            if (typeof val === 'undefined') {
                return acc;
            }

            const mapper = this.argsMapper[key as keyof T];
            if (typeof mapper === 'function') {
                return acc.concat([
                    [mapper(val as NonNullable<T[keyof T]>, this.options)]
                        .flat()
                        .filter(Boolean)
                ]);
            }
            if (val !== false) {
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
