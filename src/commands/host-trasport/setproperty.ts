import TransportCommand from '../transport';

export default class SetProp extends TransportCommand<void> {
    Cmd = 'shell:setprop ';
    protected postExecute(): Promise<void> {
        return this.parser.readAll().then((value) => {
            const valueStr = value.toString();
            if (!/^\s*$/.test(valueStr)) {
                throw new Error(valueStr);
            }
        });
    }
    execute(serial: string, prop: string, value: any): Promise<void> {
        this.Cmd += [prop, value].map((v) => this.escape(v)).join(' ');
        return this.preExecute(serial);
    }
}
