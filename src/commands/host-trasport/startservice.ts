import {
    AdbExtra,
    AdbExtraType,
    Reply,
    StartServiceOptions,
    StartActivityOptions,
    PrematureEOFError
} from '../..';
import TransportCommand from '../tranport';

// const { PrematureEOFError } = require('../../constants');
export default class StartServiceCommand extends TransportCommand {
    private formatExtraType(type: AdbExtraType) {
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
            case 'float':
                return 'l';
            case 'uri':
                return 'u';
            case 'component':
                return 'cn';
        }
    }

    private formatExtraObject(extra: AdbExtra) {
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

    private formatExtras(extras?: AdbExtra | AdbExtra[]) {
        if (!extras) {
            return [];
        }
        let result = [];
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

    private intentArgs(options: StartServiceOptions) {
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
        if (options.flags) {
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
        command = command || 'shell:am startservice ';
        return super.execute(serial, command, args.join(' ')).then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return this.parser_
                        .searchLine(/^Error: (.*)$/)
                        .finally(() => this.parser_.end())
                        .then((match) => {
                            throw new Error(match[1]);
                        })
                        .catch((err) => {
                            if (err instanceof PrematureEOFError) {
                                return;
                            } else {
                                throw err;
                            }
                        });
                case Reply.FAIL:
                    return this.parser_.readError().then((e) => {
                        throw e;
                    });
                default:
                    throw this.parser_.unexpected(reply, 'OKAY or FAIL');
            }
        });
    }
}
