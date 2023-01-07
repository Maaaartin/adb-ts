import TransportCommand from './transport';

export default abstract class TransportParseValueCommand<
    T
> extends TransportCommand<T> {
    abstract parse(value: string): T;
    protected postExecute(): Promise<T> {
        return this.parser.readValue().then((value) => {
            return this.parse(value.toString().trim());
        });
    }
}
