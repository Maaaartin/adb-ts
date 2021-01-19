import TransportCommand from "../tranport";
import Promise from 'bluebird';

export default class SetProp extends TransportCommand {
    execute(serial: string, prop: string, value: any): Promise<void> {
        return super.execute(serial, `shell:setprop ${prop} ${this.escape(value)}`).return();
    }
}