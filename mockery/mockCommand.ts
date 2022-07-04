import { PrimitiveType } from '../src';
import Command from '../lib/command';

export default class CommandMock extends Command {
    public execute(...args: PrimitiveType[]): Promise<any> {
        throw new Error('Method not implemented.');
    }
}
