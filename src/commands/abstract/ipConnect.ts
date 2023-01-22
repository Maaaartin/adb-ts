import Cmd from './cmd';

export default abstract class IpConnect extends Cmd<string> {
    protected abstract Validator: RegExp;
    keepAlive = true;
    execute(host: string, port: number): Promise<string> {
        return this.initExecute(`${this.Cmd}:${host}:${port}`)
            .then(
                this.handleReply(() => {
                    return this.parser.readValue().then((value) => {
                        const valueStr = value.toString().trim();
                        if (this.Validator.test(valueStr)) {
                            return `${host}:${port}`;
                        }
                        throw new Error(valueStr);
                    });
                })
            )
            .finally(() => {
                this.endConnection();
            });
    }
}
