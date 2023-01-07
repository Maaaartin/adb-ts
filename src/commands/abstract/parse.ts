import ValueCommand from './value';

export default abstract class ParseCommand<T = any> extends ValueCommand {
    protected abstract parse(value: string): T;
    execute(...params: any[]): Promise<T> {
        return this.preExecute(...params).then((value) => {
            return this.parse(value);
        });
    }
}
