import { Connection } from '../../connection';
import {
    PrematureEOFError,
    UnexpectedDataError,
    StartExtra,
    ExtraType,
    StartServiceOptions,
    escape
} from '../../util';
import TransportCommand from './transport';

export default abstract class StartProcess extends TransportCommand<void> {
    protected keepAlive = false;
    protected Cmd: string;

    constructor(
        connection: Connection,
        serial: string,
        command: string,
        pkg: string,
        process: string,
        options: StartServiceOptions = {}
    ) {
        super(connection, serial);
        this.Cmd = [
            command,
            ...this.intentArgs(options),
            '-n',
            escape(`${pkg}/.${process}`),
            '--user',
            escape(options.user || 0)
        ].join(' ');
    }

    protected async postExecute(): Promise<void> {
        try {
            const [, errMsg] = await this.parser.searchLine(/^Error: (.*)$/);
            throw new Error(errMsg);
        } catch (err) {
            if (!(err instanceof PrematureEOFError)) {
                throw err;
            }
        } finally {
            // TODO test, is needed?
            await this.parser.end();
        }
    }
    protected formatExtraType(type: ExtraType): string {
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

    protected formatExtraObject(extra: StartExtra): string[] {
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

    protected formatExtras(extras: StartExtra | StartExtra[] = []): string[] {
        return [extras]
            .flat()
            .map((ext) => this.formatExtraObject(ext))
            .flat();
    }

    protected keyToFlag(k: keyof StartServiceOptions): string {
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
                throw new UnexpectedDataError(String(k), 'keyof Options');
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
                        ...[options.category]
                            .flat()
                            .map((cat) =>
                                [this.keyToFlag(k_), escape(cat)].join(' ')
                            )
                    ];

                default:
                    return [...args];
            }
        }, []);
    }
}
