import Command from '../command';

export default abstract class IpConnect extends Command {
    protected abstract validator(): RegExp;
    protected abstract cmd(): string;
    execute(host: string, port: number | string): Promise<string> {
        return this.execute_(`${this.cmd()}:${host}:${port}`).then(
            this.handleReply(() => {
                return this.parser.readValue().then((value) => {
                    const valueStr = value.toString().trim();
                    if (this.validator().test(valueStr)) {
                        return `${host}:${port}`;
                    }
                    throw new Error(valueStr);
                });
            })
        );
    }
}
