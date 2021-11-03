import Promise from 'bluebird';
import { SimpleType, stringToType } from '../..';
import TransportParseAllCommand from '../transport-parse-all-command';

export default class ShellCommand extends TransportParseAllCommand {
    protected parse(value: string) {
        return stringToType(value);
    }
    execute(serial: string, command: string | string[]): Promise<SimpleType> {
        return super.execute(serial, 'shell:', command);
    }
}
