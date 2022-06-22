import TransportCommand from '../tranport';

export default class SetProp extends TransportCommand {
    execute(serial: string, prop: string, value: any): Promise<void> {
        return super
            .execute(serial, `shell:setprop ${prop} ${this.escape(value)}`)
            .then(() => {
                return this.parser_.readAll().then((value) => {
                    const valueStr = value.toString();
                    if (/failed/.test(valueStr)) {
                        throw new Error(valueStr);
                    }
                });
            });
    }
}
