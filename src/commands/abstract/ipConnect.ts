import Command from '../command';
import { ICmd } from '../../util/types';

export default abstract class IpConnect extends Command implements ICmd {
    protected abstract validator(): RegExp;
    abstract Cmd: string;
    keepAlive = true;
    execute(host: string, port: number | string): Promise<string> {
        return this.initExecute(`${this.Cmd}:${host}:${port}`)
            .then(
                this.handleReply(() => {
                    return this.parser.readValue().then((value) => {
                        const valueStr = value.toString().trim();
                        if (this.validator().test(valueStr)) {
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
