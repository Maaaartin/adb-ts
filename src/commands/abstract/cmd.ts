import Command from '../command';

export default abstract class Cmd<T> extends Command<T> {
    protected abstract Cmd: string;
}
