import Command from '../command';
import { WaitForState, WaitForType } from '../../util';

export default class WaitFor extends Command {
    protected autoEnd = false;
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
