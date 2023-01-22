import TransportCommand from './transport';

export default abstract class TransportParseAllCommand<
    T
> extends TransportCommand<T> {
    protected keepAlive = false;
    protected abstract parse(value: string): Promise<T> | T;
    protected postExecute(): Promise<T> {
        return this.parser.readAll().then((value) => {
            return this.parse(value.toString().trim());
        });
    }
}
