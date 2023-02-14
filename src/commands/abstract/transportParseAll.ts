import TransportCommand from './transport';

export default abstract class TransportParseAllCommand<
    T
> extends TransportCommand<T> {
    protected keepAlive = false;
    protected abstract parse(value: string): Promise<T> | T;
    protected async postExecute(): Promise<T> {
        const value = (await this.parser.readAll()).toString().trim();
        return this.parse(value);
    }
}
