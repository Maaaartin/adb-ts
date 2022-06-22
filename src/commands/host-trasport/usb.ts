import { Reply } from '../..';
import TransportCommand from '../tranport';

export default class UsbCommand extends TransportCommand {
    execute(serial: string) {
        return super.execute(serial, 'usb:').then((reply) => {
            switch (reply) {
                case Reply.OKAY:
                    return this.parser_.readAll().then((value) => {
                        const valueStr = value.toString();
                        if (/restarting in/.test(valueStr)) {
                            return;
                        } else {
                            throw new Error(valueStr.trim());
                        }
                    });
                case Reply.FAIL:
                    return this.parser_.readError().then((e) => {
                        throw e;
                    });
                default:
                    throw this.parser_.unexpected(reply, 'OKAY or FAIL');
            }
        });
    }
}
