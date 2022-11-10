import { IAdbDevice, DeviceState, Reply } from '.';
import Command from './command';
import Promise from 'bluebird';
import ipRegex from 'ip-regex';

export function constructDevice(device: IAdbDevice) {
  device.transport = ipRegex().test(device.id) ? 'local' : 'usb';
  device.state =
    /emulator/.test(device.id) && device.state === 'device'
      ? 'emulator'
      : device.state;
  return device;
}

export default class DevicesCommand extends Command {
  protected parse(value: string) {
    const devices = [];
    const valueStr = value;
    if (!value.length) {
      return devices;
    }
    const lines = valueStr.split('\n');
    for (const line of lines) {
      if (line) {
        const tmp = line.split(/\s+/);
        devices.push(
          constructDevice({
            id: tmp[0],
            state: tmp[1] as DeviceState,
            path: tmp[2],
            product: tmp[3],
            model: tmp[4],
            device: tmp[5],
            transportId: tmp[6],
            transport: 'any',
          })
        );
      }
    }
    return devices;
  }

  readDevices() {
    return this.parser.readValue().then((value) => {
      return this.parse(value.toString().trim());
    });
  }

  execute(command: string): Promise<any> {
    return super.execute(command).then((reply) => {
      switch (reply) {
        case Reply.OKAY:
          return;
        case Reply.FAIL:
          return this.parser.readError();
        default:
          return this.parser.unexpected(reply, 'OKAY or FAIL');
      }
    });
  }
}
