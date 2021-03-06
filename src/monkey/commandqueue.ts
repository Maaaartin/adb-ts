import Command from "./command";
import Api from "./api";
import Monkey from "./client";
import { MonkeyCallback } from "..";

export default class Multi extends Api {
    private client: Monkey;
    private commands: Command[] = [];
    private replies = [];
    private errors: string[] = [];
    private counter = 0;
    private sent = false;
    private callback?: (err?: Error, data?: string[]) => void;
    private collector: MonkeyCallback;
    constructor(client: Monkey) {
        super();
        this.client = client;

        this.collector = (err, result, cmd) => {
            if (err) {
                this.errors.push(`${cmd}: ${err.message}`);
            }
            this.replies.push(result);
            this.counter -= 1;
            return this.maybeFinish();
        }
    }

    private maybeFinish() {
        if (!this.counter) {
            if (this.errors.length) {
                setImmediate(() => {
                    this.callback?.(new Error(this.errors.join(', ')));
                });
            }
            else {
                setImmediate(() => {
                    this.callback?.(null, this.replies);
                })
            }
        }
    }

    private forbidReuse() {
        if (this.sent) {
            throw new Error("Reuse not supported");
        }
    }

    send(command: string) {
        this.forbidReuse();
        this.commands.push(new Command(command, this.collector));
        return this;
    }

    execute(cb: (err?: Error, data?: string[]) => void) {
        this.forbidReuse();
        this.counter = this.commands.length;
        this.sent = true;
        this.callback = cb;
        if (!this.counter) return;

        const parts = [];
        for (const command of this.commands) {
            this.client.queue.push(command);
            parts.push(command.command);
        }
        parts.push('');
        this.commands = [];
        this.client.getStream().write(parts.join('\n'));
    }

}