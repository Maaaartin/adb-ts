import {
    PrematureEOFError,
    UnexpectedDataError,
    StartExtra,
    ExtraType,
    StartServiceOptions,
    escape
} from '../../util';
import TransportCommand from '../abstract/transport';

export default class StartServiceCommand extends TransportCommand<void> {
    protected keepAlive = false;
    protected Cmd = 'shell:am startservice ';
    protected postExecute(): Promise<void> {
        return this.parser
            .searchLine(/^Error: (.*)$/)
            .finally(() => this.parser.end())
            .then(
                ([, errMsg]) => {
                    throw new Error(errMsg);
                },
                (err) => {
                    if (!(err instanceof PrematureEOFError)) {
                        throw err;
                    }
                }
            );
    }
    private formatExtraType(type: ExtraType): string {
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

    private formatExtraObject(extra: StartExtra): string[] {
        const type = this.formatExtraType(extra.type);
        if (extra.type === 'null') {
            return ['--e' + type, escape(extra.key)];
        }
        if (Array.isArray(extra.value)) {
            return [
                '--e' + type + 'a',
                escape(extra.key),
                (extra.value as (string | number)[]).map(escape).join(',')
            ];
        }
        return ['--e' + type, escape(extra.key), escape(extra.value)];
    }

    private formatExtras(extras: StartExtra | StartExtra[] = []): string[] {
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
                    return [...args, this.keyToFlag(k_), escape(options[k_])];
                case 'category':
                    return [
                        ...args,
                        ...(Array.isArray(options.category)
                            ? options.category
                            : [options.category]
                        ).map((cat) =>
                            [this.keyToFlag(k_), escape(cat)].join(' ')
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
                escape(`${pkg}/.${service}`),
                '--user',
                escape(options.user || 0)
            ].join(' ')
        );

        return this.preExecute(serial);
    }
}
