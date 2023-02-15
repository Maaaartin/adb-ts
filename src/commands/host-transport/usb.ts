import RestartConnection from '../abstract/restartConnection';

export default class UsbCommand extends RestartConnection {
    protected keepAlive = false;
    protected Cmd = 'usb:';
}
