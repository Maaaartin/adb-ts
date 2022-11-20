import RestartConnection from '../restartConnection';

export default class UsbCommand extends RestartConnection {
    Cmd = 'usb:';
    execute(serial: string): Promise<void> {
        return this.preExecute(serial);
    }
}
