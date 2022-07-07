import { Reply } from '../..';
import Command from '../../command';

export default class ConnectCommand extends Command {
    execute(host: string, port: number | string): Promise<string> {
        return this.execute_(`host:connect:${host}:${port}`).then(
            this.handleReply(() => {
                return this.parser.readValue().then((value) => {
                    const regExp = /connected to|already connected/;
                    const valueStr = value.toString().trim();
                    if (regExp.test(valueStr)) {
                        return `${host}:${port}`;
                    }
                    throw new Error(valueStr);
                });
            })
        );
    }
}
