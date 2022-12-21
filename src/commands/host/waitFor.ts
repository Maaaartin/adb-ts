import Command from '../../command';
import { WaitForState, WaitForType } from '../../util/types';

export default class WaitFor extends Command {
    protected keepAlive = true;
    execute(transport: WaitForType, state: WaitForState): Promise<void> {
        return this.initExecute(`host:wait-for-${transport}-${state}`)
            .then(
                this.handleReply(() =>
                    this.parser.readAscii(4).then(this.handleReply(undefined))
                )
            )
            .finally(() => {
                this.endConnection();
            });
    }
}
