import {
    AdbExtra,
    AdbExtraType,
    StartServiceOptions,
    StartActivityOptions,
    PrematureEOFError,
    UnexpectedDataError
} from '../..';
import TransportCommand from '../transport';

export default class StartServiceCommand extends TransportCommand<void> {
    Cmd = 'shell:am startservice ';
    protected postExecute(): Promise<void> {
        return this.parser
            .searchLine(/^Error: (.*)$/)
            .finally(() => this.parser.end())
            .then(([, errMsg]) => {
                throw new Error(errMsg);
            })
            .catch((err) => {
                if (!(err instanceof PrematureEOFError)) {
                    throw err;
                }
            });
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
        const args: string[] = [];
        const type = this.formatExtraType(extra.type);
        if (extra.type === 'null') {
            args.push('--e' + type);
            args.push(this.escape(extra.key));
        } else if (Array.isArray(extra.value)) {
            args.push('--e' + type + 'a');
            args.push(this.escape(extra.key));
            args.push(this.escape(extra.value.join(',')));
        } else {
            args.push('--e' + type);
            args.push(this.escape(extra.key));
            args.push(this.escape(extra.value));
        }
        return args;
    }

    private formatExtras(extras?: AdbExtra | AdbExtra[]): string[] {
        if (!extras) {
            return [];
        }
        const result = [];
        if (Array.isArray(extras)) {
            for (const item of extras) {
                result.push(...this.formatExtraObject(item));
            }
            return result;
        } else {
            result.push(...this.formatExtraObject(extras));
            return result;
        }
    }

    private intentArgs(options: StartServiceOptions): string[] {
        const args: string[] = [];
        if (options.extras) {
            args.push(...this.formatExtras(options.extras));
        }
        if (options.action) {
            args.push('-a', this.escape(options.action));
        }
        if (options.data) {
            args.push('-d', this.escape(options.data));
        }
        if (options.mimeType) {
            args.push('-t', this.escape(options.mimeType));
        }
        if (options.category) {
            if (Array.isArray(options.category)) {
                options.category.forEach((category) => {
                    return args.push('-c', this.escape(category));
                });
            } else {
                args.push('-c', this.escape(options.category));
            }
        }

        if (typeof options.flags === 'number') {
            args.push('-f', this.escape(options.flags));
        }
        return args;
    }

    execute(
        serial: string,
        pkg: string,
        service: string,
        options?: StartServiceOptions,
        command?: string
    ): Promise<void> {
        options = options || {};
        const args = this.intentArgs(options);
        if ((options as StartActivityOptions).debug) {
            args.push('-D');
        }
        if ((options as StartActivityOptions).wait) {
            args.push('-W');
        }
        args.push('-n', this.escape(`${pkg}/.${service}`));
        args.push('--user', this.escape(options.user || 0));
        this.Cmd = (command || this.Cmd).concat(args.join(' '));

        return super.preExecute(serial);
    }
}
