import RestartConnection from '../abstract/restartConnection';

export default class UsbCommand extends RestartConnection {
    Cmd = 'usb:';
    execute(serial: string): Promise<void> {
        return this.preExecute(serial);
    }
}
