import TransportParseAllCommand from '../abstract/transportParseAll';
import { escape } from '../../util';

export default class SetProp extends TransportParseAllCommand<void> {
    Cmd = 'shell:setprop ';
    protected parse(value: string): void {
        if (!/^\s*$/.test(value)) {
            throw new Error(value);
        }
    }
    execute(serial: string, prop: string, value: any): Promise<void> {
        this.Cmd += [prop, value].map((v) => escape(v)).join(' ');
        return this.preExecute(serial);
    }
}
