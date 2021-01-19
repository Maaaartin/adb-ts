import { AdbClient, Command, encodeData, KeyCode, Reply, stringToType, TransportCommand } from './src/index';
import Jimp from 'jimp';
import * as net from 'net';

class MyCommand extends Command {
    execute(serial: string) {
        return super.execute('host:version')
            .then((reply) => {
                switch (reply) {
                    case Reply.OKAY:
                        return this.parser.readValue().then((value) => {
                            return parseInt(value.toString(), 10)
                        });
                    case Reply.FAIL:
                        return this.parser.readError();
                    default:
                        return parseInt(reply, 10);
                }
            });
    }
}

const adb = new AdbClient({ bin: 'C:\\spree\\platform-tools\\adb.exe' });
adb.map((device) => {
    device.install('C:\\spree\\UPDATE\\holotasker.apk', {
        reinstall: true
    }, (err) => {

    })
})