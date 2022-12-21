import { AdbExtra, AdbExtraType, StartServiceOptions } from '../..';
import { PrematureEOFError, UnexpectedDataError } from '../../util/errors';
import TransportCommand from '../transport';

export default class StartServiceCommand extends TransportCommand<void> {
    Cmd = 'shell:am startservice ';
    protected postExecute(): Promise<void> {
        return this.parser
            .searchLine(/^Error: (.*)$/)
            .finally(() => this.parser.end())
            .then(
                ([, errMsg]) => {
                    throw new Error(errMsg);
                },
                (err) => {
                    if (err instanceof PrematureEOFError) {
                        return;
                    }
                    throw err;
                }
            );
    }
    private formatExtraType(type: AdbExtraType): string {
        switch (type) {
            case 'string':
                return 's';
            case 'null':
                return 'sn';
            case 'bool':
                return 'z';
            case 'int':
                return 'i';
            case 'long':
                return 'l';
            case 'float':
                return 'f';
            case 'uri':
                return 'u';
            case 'component':
                return 'cn';
            default:
                throw new UnexpectedDataError(type, 'AdbExtraType');
        }
    }

    private formatExtraObject(extra: AdbExtra): string[] {
        const type = this.formatExtraType(extra.type);
        if (extra.type === 'null') {
            return ['--e' + type, this.escape(extra.key)];
        }
        if (Array.isArray(extra.value)) {
            return [
                '--e' + type + 'a',
                this.escape(extra.key),
                (extra.value as (string | number)[])
                    .map((val) => this.escape(val))
                    .join(',')
            ];
        }
        return ['--e' + type, this.escape(extra.key), this.escape(extra.value)];
    }

    private formatExtras(extras: AdbExtra | AdbExtra[] = []): string[] {
        return [extras]
            .flat()
            .map((ext) => this.formatExtraObject(ext))
            .flat();
    }

    private keyToFlag(k: keyof StartServiceOptions): string {
        switch (k) {
            case 'action':
                return '-a';
            case 'data':
                return '-d';
            case 'mimeType':
                return '-t';
            case 'category':
                return '-c';
            case 'flags':
                return '-f';
            default:
                throw new UnexpectedDataError(k, 'keyof StartServiceOptions');
        }
    }
    protected intentArgs(options: StartServiceOptions): string[] {
        return Object.entries(options).reduce<string[]>((args, [k, v]) => {
            if (typeof v === 'undefined') {
                return [...args];
            }
            const k_ = k as keyof StartServiceOptions;

            switch (k_) {
                case 'extras':
                    return [...args, ...this.formatExtras(options.extras)];

                case 'action':
                case 'data':
                case 'mimeType':
                case 'flags':
                    return [
                        ...args,
                        this.keyToFlag(k_),
                        this.escape(options[k_])
                    ];
                case 'category':
                    return [
                        ...args,
                        ...(Array.isArray(options.category)
                            ? options.category
                            : [options.category]
                        ).map((cat) =>
                            [this.keyToFlag(k_), this.escape(cat)].join(' ')
                        )
                    ];

                default:
                    return [...args];
            }
        }, []);
    }

    execute(
        serial: string,
        pkg: string,
        service: string,
        options: StartServiceOptions = {}
    ): Promise<void> {
        this.Cmd = this.Cmd.concat(
            [
                ...this.intentArgs(options),
                '-n',
                this.escape(`${pkg}/.${service}`),
                '--user',
                this.escape(options.user || 0)
            ].join(' ')
        );

        return this.preExecute(serial);
    }
}
