import TransportCommand from './transport';

export default abstract class RestartConnection extends TransportCommand<void> {
    protected postExecute(): Promise<void> {
        return this.parser.readAll().then((value) => {
            const valueStr = value.toString().trim();
            if (!/restarting in/.test(valueStr)) {
                throw new Error(valueStr || 'No error message');
            }
        });
    }
}
