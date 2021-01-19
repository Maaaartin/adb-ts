import DevicesCommand from '../../devices';

export default class TrackCommand extends DevicesCommand {
    execute() {
        return super.execute('host:track-devices-l');
    }
}