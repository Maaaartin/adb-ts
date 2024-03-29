import net from 'net';

type MonkeyReply = { status: 'OK' | 'ERROR'; reply: string };

export default class MonkeyMock {
    private replies_: MonkeyReply[] = [];
    private server_ = net.createServer();

    constructor(replies: MonkeyReply[]) {
        this.replies_ = replies;
    }

    public end(): void {
        this.server_.close();
    }

    private buildReply(reply: MonkeyReply): string {
        return `${reply.status}:${reply.reply}\n`;
    }

    private respond(data: string, socket: net.Socket): void {
        data.split('\n')
            .filter(Boolean)
            .forEach(() => {
                const reply = this.replies_.shift();
                if (!reply) {
                    return;
                }

                socket.write(this.buildReply(reply));
            });
    }

    private hook(): void {
        this.server_.on('connection', (socket) => {
            socket.on('data', (data) => {
                this.respond(data.toString(), socket);
            });
        });
    }

    protected getPort(): number {
        const info = this.server_.address();
        if (typeof info === 'string' || info === null) {
            throw new Error('Could not get server port');
        }
        return info.port;
    }

    public start(): Promise<number> {
        return new Promise((resolve, reject) => {
            if (!this.server_.listening) {
                this.server_.once('error', reject);
                this.server_.listen(() => {
                    try {
                        this.hook();
                        resolve(this.getPort());
                        this.server_.removeListener('error', reject);
                    } catch (e: unknown) {
                        reject(e);
                    }
                });
            } else {
                try {
                    resolve(this.getPort());
                } catch (e: unknown) {
                    reject(e);
                }
            }
        });
    }
}
