import TransportCommand from '../transport';

export default class SetProp extends TransportCommand<void> {
    Cmd = 'shell:setprop ';
    protected postExecute(): Promise<void> {
        return this.parser.readAll().then((value) => {
            const valueStr = value.toString();
            if (/failed/i.test(valueStr)) {
                throw new Error(valueStr);
            }
        });
    }
    execute(serial: string, prop: string, value: any): Promise<void> {
        this.Cmd += `${prop} ${this.escape(value)}`;
        return this.preExecute(serial);
    }
}
