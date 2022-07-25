import TransportCommand from './tranport';

export default abstract class TransportParseAllCommand<
    T
> extends TransportCommand<T> {
    protected abstract parse(value: string): Promise<T> | T;
    protected postExecute(): Promise<T> {
        return this.parser.readAll().then((value) => {
            return this.parse(value.toString().trim());
        });
    }
}
