import Command from '../command';
import { ICmd } from '../../util';

export default abstract class IpConnect extends Command implements ICmd {
    protected abstract Validator: RegExp;
    abstract Cmd: string;
    keepAlive = true;
    execute(host: string, port: number | string): Promise<string> {
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
