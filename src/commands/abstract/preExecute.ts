import Command from '../command';

export default abstract class PreExecute<T> extends Command<T> {
    protected abstract preExecute(...params: any[]): Promise<T>;
}
