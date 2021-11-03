import EmptyCommand from '../empty-command';

export default class RemountCommand extends EmptyCommand {
    execute(serial: string) {
        return super.execute(serial, 'remount:');
    }
}
