import TransportCommand from './transport';

export default abstract class TransportParseValueCommand<
    T
> extends TransportCommand<T> {
    protected keepAlive = false;
    protected abstract parse(value: string): T;
    protected async postExecute(): Promise<T> {
        const value = (await this.parser.readValue()).toString().trim();
        return this.parse(value);
    }
}
