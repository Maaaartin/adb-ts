import TransportCommand from '../tranport';

export default class InputCommand extends TransportCommand {
    execute(serial: string, param1: string, param2: string, ...args: any[]) {
        return super
            .execute(
                serial,
                'shell:input',
                param1,
                param2,
                ...args.map((arg) => this.escape(arg))
            )
            .thenReturn();
    }
}
