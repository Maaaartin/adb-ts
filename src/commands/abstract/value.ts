import Cmd from './cmd';

export default abstract class ValueCommand<T> extends Cmd<T> {
    protected abstract parse(value: string): T;
    public async execute(): Promise<T> {
        await this.initAndValidateReply(this.Cmd);
        const value = (await this.parser.readValue()).toString().trim();
        return this.parse(value);
    }
}
