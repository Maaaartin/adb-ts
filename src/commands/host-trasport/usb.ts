import { Reply } from '../..';
import TransportCommand from '../tranport';

export default class UsbCommand extends TransportCommand {
    execute(serial: string) {
        return super.execute(serial, 'usb:').then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return this.parser.readAll().then((value) => {
                        const valueStr = value.toString();
                        if (/restarting in/.test(valueStr)) {
                            return;
                        } else {
                            throw new Error(valueStr.trim());
                        }
                    });
                case Reply.FAIL:
                    return this.parser.readError();
                default:
                    return this.parser.unexpected(reply, 'OKAY or FAIL');
            }
        });
    }
}
