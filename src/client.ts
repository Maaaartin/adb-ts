import Promise from 'bluebird';
import { exec, execFile } from 'child_process';
import { EventEmitter } from 'events';
import fs, { Stats } from 'fs';
import Jimp from 'jimp';
import { Readable } from 'stream';
import stringToStreamfrom from 'string-to-stream';
import {
  AdbClientOptions,
  CommandConstruct,
  ForwardsObject,
  IAdbDevice,
  InputOptions,
  InputSource,
  InstallOptions,
  KeyStringObject,
  LogcatOptions,
  ReversesObject,
  SettingsMode,
  SimpleType,
  StartActivityOptions,
  StartServiceOptions,
  TransportType,
  UninstallOptions,
  WaitForState,
} from '.';
import ForwardCommand from './commands/host-serial/forward';
import GetDevicePathCommand from './commands/host-serial/getdevicepath';
import ListForwardsCommand from './commands/host-serial/listforwards';
import BatteryStatusCommand from './commands/host-trasport/baterrystatus';
import ClearCommand from './commands/host-trasport/clear';
import GetPropertyCommand from './commands/host-trasport/getproperty';
import GetSetting from './commands/host-trasport/getsetting';
import InputCommand from './commands/host-trasport/input';
import InstallCommand from './commands/host-trasport/install';
import GetIpAddressCommand from './commands/host-trasport/ipaddress';
import IsInstalledCommand from './commands/host-trasport/isinstalled';
import ListFeaturesCommand from './commands/host-trasport/listfeatures';
import ListPackagesCommand from './commands/host-trasport/listpackages';
import ListPropertiesCommand from './commands/host-trasport/listproperties';
import ListReversesCommand from './commands/host-trasport/listreverses';
import ListSettingsCommand from './commands/host-trasport/listsettings';
import LogcatCommand from './commands/host-trasport/logcat';
import MonkeyCommand from './commands/host-trasport/monkey';
import PutSetting from './commands/host-trasport/putsetting';
import RebootCommand from './commands/host-trasport/reboot';
import RemountCommand from './commands/host-trasport/remount';
import ReverseCommand from './commands/host-trasport/reverse';
import RootCommand from './commands/host-trasport/root';
import ScreenShotCommand from './commands/host-trasport/screencap';
import SetProp from './commands/host-trasport/setproperty';
import ShellCommand from './commands/host-trasport/shell';
import ShellRawCommand from './commands/host-trasport/shellraw';
import ShutdownCommand from './commands/host-trasport/shutdown';
import StartActivityCommand from './commands/host-trasport/startactivity';
import StartServiceCommand from './commands/host-trasport/startservice';
import SyncCommand from './commands/host-trasport/sync';
import TcpCommand from './commands/host-trasport/tcp';
import TcpIpCommand from './commands/host-trasport/tcpip';
import UninstallCommand from './commands/host-trasport/uninstall';
import UsbCommand from './commands/host-trasport/usb';
import WaitBootCompleteCommand from './commands/host-trasport/wainbootcomplete';
import ConnectCommand from './commands/host/connect';
import DisconnectCommand from './commands/host/disconnect';
import KillCommand from './commands/host/kill';
import ListDevicesCommand from './commands/host/listdevices';
import TrackCommand from './commands/host/trackdevices';
import HostTransportCommand from './commands/host/transport';
import VersionCommand from './commands/host/version';
import WaitForDeviceCommand from './commands/host/waitfordevice';
import Connection from './connection';
import AdbDevice from './device';
import { KeyCode } from './keycode';
import Logcat from './logcat';
import LogcatReader from './logcat/reader';
import Monkey from './monkey/client';
import Parser from './parser';
import Sync, { SyncMode } from './sync';
import SyncEntry from './sync/entry';
import PullTransfer from './sync/pulltransfer';
import PushTransfer from './sync/pushtransfer';
import Tracker from './tracker';

export default class AdbClient extends EventEmitter {
  private options: AdbClientOptions;
  constructor(options?: AdbClientOptions) {
    super();
    this.options = options = options || {};
    this.options.port = options.port || 5037;
    this.options.host = options.host || 'localhost';
    this.options.bin = options.bin || 'adb';
    this.options.noAutoStart =
      options.noAutoStart != undefined ? options.noAutoStart : false;
  }

  startServer(cb?: (err: Error) => void): Promise<void> {
    const port = this.options.port;
    const args = port
      ? ['-P', port.toString(), 'start-server']
      : ['start-server'];
    console.log('Starting ADB server');
    return new Promise<void>((resolve, reject) => {
      execFile(this.options.bin, args, (err) => {
        if (err) return reject(err);
        else return resolve();
      });
    }).nodeify(cb);
  }

  private connection() {
    let triedStarting = false;
    const connection = new Connection();
    return new Promise<Connection>((resolve, reject) => {
      connection.connect(this.options);
      connection.once('connect', () => {
        return resolve(connection);
      });
      connection.on('error', (err: any) => {
        if (
          err.code === 'ECONNREFUSED' &&
          !triedStarting &&
          !this.options?.noAutoStart
        ) {
          triedStarting = true;
          return this.startServer().then(() => {
            return connection.connect(this.options);
          });
        } else {
          connection.end();
          connection.removeAllListeners();
          return reject(err);
        }
      });
    });
  }

  transport(serial: string): Promise<Connection> {
    return this.connection().then((conn) => {
      return new HostTransportCommand(conn).execute(serial).return(conn);
    });
  }

  version(cb?: (err: Error, value?: number) => void) {
    return this.connection()
      .then((conn) => {
        return new VersionCommand(conn).execute();
      })
      .nodeify(cb);
  }

  connect(
    host: string,
    cb?: (err: Error, value: number) => void
  ): Promise<string>;
  connect(
    host: string,
    port?: number,
    cb?: (err: Error, value: number) => void
  ): Promise<string>;
  connect(host: string, port?: any, cb?: (err: Error, value: number) => void) {
    if (typeof port === 'function') {
      cb = port;
      port = undefined;
    }
    if (host && host.indexOf(':') !== -1) {
      const tmp = host.split(':', 2);
      host = tmp[0];
      port = Number(tmp[1]);
    }
    if (!port) port = 5555;
    return this.connection()
      .then((conn) => {
        return new ConnectCommand(conn).execute(host, port);
      })
      .nodeify(cb);
  }
  disconnect(
    host: string,
    cb?: (err: Error, value: number) => void
  ): Promise<string>;
  disconnect(
    host: string,
    port?: number,
    cb?: (err: Error, value: number) => void
  ): Promise<string>;
  disconnect(
    host: string,
    port?: any,
    cb?: (err: Error, value: number) => void
  ) {
    if (typeof port === 'function') {
      cb = port;
      port = undefined;
    }
    if (host.indexOf(':') !== -1) {
      const tmp = host.split(':', 2);
      host = tmp[0];
      port = Number(tmp[1]);
    }
    if (!port) port = 5555;
    return this.connection().then((conn) => {
      return new DisconnectCommand(conn).execute(host, port);
    });
  }

  listDevices(cb?: (err: Error, value: IAdbDevice[]) => void) {
    return this.connection()
      .then((conn) => {
        return new ListDevicesCommand(conn).execute();
      })
      .nodeify(cb);
  }

  trackDevices(cb?: (err: Error, value: Tracker) => void) {
    return this.connection().then((conn) => {
      const command = new TrackCommand(conn);
      const prom = command
        .execute()
        .then(() => {
          return new Tracker(command, this);
        })
        .nodeify(cb);
      return prom;
    });
  }

  kill(cb?: (err: Error) => void) {
    return this.connection()
      .then((conn) => {
        return new KillCommand(conn).execute();
      })
      .nodeify(cb);
  }

  getSerialNo(serial: string, cb?: (err: Error, value: string) => void) {
    return this.getProp(serial, 'ro.serialno', cb);
  }

  getDevicePath(serial: string, cb?: (err: Error, value: string) => void) {
    return this.connection()
      .then((conn) => {
        return new GetDevicePathCommand(conn).execute(serial);
      })
      .nodeify(cb);
  }

  listProperties(
    serial: string,
    cb?: (err: Error, value: KeyStringObject) => void
  ) {
    return this.connection()
      .then((conn) => {
        return new ListPropertiesCommand(conn).execute(serial);
      })
      .nodeify(cb);
  }

  listFeatures(
    serial: string,
    cb?: (err: Error, value: KeyStringObject) => void
  ) {
    return this.connection()
      .then((conn) => {
        return new ListFeaturesCommand(conn).execute(serial);
      })
      .nodeify(cb);
  }

  listPackages(serial: string, cb?: (err: Error, value: string[]) => void) {
    return this.connection()
      .then((conn) => {
        return new ListPackagesCommand(conn).execute(serial);
      })
      .nodeify(cb);
  }

  getIpAddress(
    serial: string,
    cb?: (err: Error, value: string) => void
  ): Promise<string | undefined> {
    return this.connection()
      .then((conn) => {
        return new GetIpAddressCommand(conn).execute(serial);
      })
      .nodeify(cb);
  }

  forward(
    serial: string,
    local: string,
    remote: string,
    cb?: (err: Error) => void
  ) {
    return this.connection()
      .then((conn) => {
        return new ForwardCommand(conn).execute(serial, local, remote);
      })
      .nodeify(cb);
  }

  listForwards(
    serial: string,
    cb?: (err: Error, value: ForwardsObject[]) => void
  ) {
    return this.connection()
      .then((conn) => {
        return new ListForwardsCommand(conn).execute(serial);
      })
      .nodeify(cb);
  }

  reverse(
    serial: string,
    local: string,
    remote: string,
    cb?: (err: Error) => void
  ) {
    return this.connection()
      .then((conn) => {
        return new ReverseCommand(conn).execute(serial, local, remote);
      })
      .nodeify(cb);
  }

  listReverses(
    serial: string,
    cb?: (err: Error, value: ReversesObject[]) => void
  ) {
    return this.connection()
      .then((conn) => {
        return new ListReversesCommand(conn).execute(serial);
      })
      .nodeify(cb);
  }

  private shellInternal(serial: string, command: string | string[]) {
    return this.connection().then((conn) => {
      return new ShellRawCommand(conn).execute(serial, command);
    });
  }

  reboot(serial: string, cb?: (err: Error) => void) {
    return this.connection()
      .then((conn) => {
        return new RebootCommand(conn).execute(serial);
      })
      .nodeify(cb);
  }

  shutdown(serial: string, cb?: (err: Error) => void) {
    return this.connection()
      .then((conn) => {
        return new ShutdownCommand(conn).execute(serial);
      })
      .nodeify(cb);
  }

  remount(serial: string, cb?: (err: Error) => void) {
    return this.connection()
      .then((conn) => {
        return new RemountCommand(conn).execute(serial);
      })
      .nodeify(cb);
  }

  root(serial: string, cb?: (err: Error) => void) {
    return this.connection()
      .then((conn) => {
        return new RootCommand(conn).execute(serial);
      })
      .nodeify(cb);
  }

  screenshot(
    serial: string,
    cb?: (err: Error, value: Jimp) => void
  ): Promise<Jimp> {
    return this.connection()
      .then((conn) => {
        return new ScreenShotCommand(conn).execute(serial).then((transform) => {
          return new Promise<Jimp>((resolve, reject) => {
            const bufs = [];
            transform.on('data', (data) => {
              bufs.push(data);
            });
            transform.on('end', () => {
              Jimp.read(Buffer.concat(bufs)).then(resolve).catch(reject);
            });
            transform.on('error', reject);
          });
        });
      })
      .nodeify(cb);
  }

  openTcp(
    serial: string,
    port: number | string,
    cb?: (err: Error, value: Connection) => void
  ): Promise<Connection>;
  openTcp(
    serial: string,
    port: number | string,
    host?: string,
    cb?: (err: Error, value: Connection) => void
  ): Promise<Connection>;
  openTcp(
    serial: string,
    port: number | string,
    host?: any,
    cb?: (err: Error, value: Connection) => void
  ): Promise<any> {
    if (typeof host === 'function') {
      cb = host;
      host = undefined;
    }
    return this.transport(serial)
      .then((conn) => {
        return new TcpCommand(conn).execute(port, host);
      })
      .nodeify(cb);
  }

  roll(
    serial: string,
    x: number,
    y: number,
    cb?: (err: Error) => void
  ): Promise<void>;
  roll(
    serial: string,
    x: number,
    y: number,
    source?: InputSource,
    cb?: (err: Error) => void
  ): Promise<void>;
  roll(
    serial: string,
    x: number,
    y: number,
    source: any,
    cb?: (err: Error) => void
  ) {
    if (typeof source === 'function') {
      cb = source;
    }
    source = source || 'trackball';
    return this.connection()
      .then((conn) => {
        return new InputCommand(conn).execute(serial, source, 'roll', x, y);
      })
      .nodeify(cb);
  }

  press(serial: string, cb?: (err: Error) => void): Promise<void>;
  press(
    serial: string,
    source?: InputSource,
    cb?: (err: Error) => void
  ): Promise<void>;
  press(serial: string, source: any, cb?: (err: Error) => void) {
    if (typeof source === 'function') {
      cb = source;
    }
    source = source || 'trackball';
    return this.connection()
      .then((conn) => {
        return new InputCommand(conn).execute(serial, source, 'press');
      })
      .nodeify(cb);
  }

  dragAndDrop(
    serial: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    cb?: (err: Error) => void
  ): Promise<void>;
  dragAndDrop(
    serial: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options?: InputOptions & { duration?: number },
    cb?: (err: Error) => void
  ): Promise<void>;
  dragAndDrop(
    serial: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options?: any,
    cb?: (err: Error) => void
  ) {
    if (typeof options === 'function' || !options) {
      cb = options;
      options = {};
    }
    options.source = options.source || 'touchscreen';
    return this.connection()
      .then((conn) => {
        return new InputCommand(conn).execute(
          serial,
          options.source,
          'draganddrop',
          x1,
          y1,
          x2,
          y2,
          options.duration ? options.duration : ''
        );
      })
      .nodeify(cb);
  }

  swipe(
    serial: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    cb?: (err: Error) => void
  ): Promise<void>;
  swipe(
    serial: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options?: InputOptions & { duration?: number },
    cb?: (err: Error) => void
  ): Promise<void>;
  swipe(
    serial: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options?: any,
    cb?: (err: Error) => void
  ) {
    if (typeof options === 'function' || !options) {
      cb = options;
      options = {};
    }
    options.source = options.source || 'touchscreen';
    return this.connection()
      .then((conn) => {
        return new InputCommand(conn).execute(
          serial,
          options.source,
          'swipe',
          x1,
          y1,
          x2,
          y2,
          options.duration ? options.duration : ''
        );
      })
      .nodeify(cb);
  }

  keyEvent(
    serial: string,
    code: KeyCode | number,
    cb?: (err: Error) => void
  ): Promise<void>;
  keyEvent(
    serial: string,
    code: KeyCode | number,
    options?: InputOptions & { longpress?: boolean },
    cb?: (err: Error) => void
  ): Promise<void>;
  keyEvent(
    serial: string,
    code: KeyCode | number,
    options?: any,
    cb?: (err: Error) => void
  ) {
    if (typeof options === 'function' || !options) {
      cb = options;
      options = {};
    }
    options.source = options.source || 'keyboard';
    return this.connection()
      .then((conn) => {
        return new InputCommand(conn).execute(
          serial,
          'keyevent',
          options.source,
          code,
          options.longpress ? '--longpress' : ''
        );
      })
      .nodeify(cb);
  }

  tap(
    serial: string,
    x: number,
    y: number,
    cb?: (err: Error) => void
  ): Promise<void>;
  tap(
    serial: string,
    x: number,
    y: number,
    source: InputSource,
    cb?: (err: Error) => void
  ): Promise<void>;
  tap(
    serial: string,
    x: number,
    y: number,
    source: any,
    cb?: (err: Error) => void
  ) {
    if (typeof source === 'function') {
      cb = source;
    }
    source = source || 'touchscreen';
    return this.connection()
      .then((conn) => {
        return new InputCommand(conn).execute(serial, source, 'tap', x, y);
      })
      .nodeify(cb);
  }

  text(
    serial: string,
    text: SimpleType,
    cb?: (err: Error) => void
  ): Promise<void>;
  text(
    serial: string,
    text: SimpleType,
    source: InputSource,
    cb?: (err: Error) => void
  ): Promise<void>;
  text(
    serial: string,
    text: SimpleType,
    source: any,
    cb?: (err: Error) => void
  ) {
    if (typeof source === 'function') {
      cb = source;
    }
    source = source || 'touchscreen';
    return this.connection()
      .then((conn) => {
        return new InputCommand(conn).execute(serial, source, 'text', text);
      })
      .nodeify(cb);
  }

  openLogcat(
    serial: string,
    cb?: (err: Error, value: LogcatReader) => void
  ): Promise<LogcatReader>;
  openLogcat(
    serial: string,
    options?: LogcatOptions,
    cb?: (err: Error, value: LogcatReader) => void
  ): Promise<LogcatReader>;
  openLogcat(
    serial: string,
    options?: any,
    cb?: (err: Error, value: LogcatReader) => void
  ) {
    if (typeof options === 'function') {
      cb = options;
      options = undefined;
    }
    return this.connection()
      .then((conn) => {
        return new LogcatCommand(conn)
          .execute(serial, options)
          .then((stream) => {
            const logCat = Logcat.readStrem(stream, {
              ...options,
              fixLineFeeds: false,
            });
            conn.on('error', (err) => logCat.emit('error', err));
            return logCat;
          });
      })
      .nodeify(cb);
  }

  private syncService(serial: string) {
    return this.connection().then((conn) => {
      return new SyncCommand(conn).execute(serial);
    });
  }

  clear(serial: string, pkg: string, cb?: (err: Error) => void) {
    return this.connection()
      .then((conn) => {
        return new ClearCommand(conn).execute(serial, pkg);
      })
      .nodeify(cb);
  }

  private installRemote(
    serial: string,
    apk: string,
    options?: InstallOptions,
    args?: string
  ) {
    return this.connection().then((conn) => {
      return new InstallCommand(conn)
        .execute(serial, apk, options, args)
        .then(() => {
          return this.shellInternal(serial, ['rm', '-f', apk]).then(
            (stream) => {
              return new Parser(stream).readAll().return();
            }
          );
        });
    });
  }

  install(
    serial: string,
    apk: string | Readable,
    cb?: (err: Error) => void
  ): Promise<void>;
  install(
    serial: string,
    apk: string | Readable,
    options?: InstallOptions,
    cb?: (err: Error) => void
  ): Promise<void>;
  install(
    serial: string,
    apk: string | Readable,
    options?: InstallOptions,
    args?: string,
    cb?: (err: Error) => void
  ): Promise<void>;
  install(
    serial: string,
    apk: string | Readable,
    options?: any,
    args?: any,
    cb?: (err: Error) => void
  ): Promise<void> {
    if (typeof options === 'function') {
      cb = options;
      options = undefined;
    }
    if (typeof args === 'function') {
      cb = args;
      args = undefined;
    }
    const temp = Sync.temp(typeof apk === 'string' ? apk : '_stream.apk');
    return this.push(serial, apk, temp).then((transfer) => {
      let errorListener: (err: Error) => void;
      let endListener: VoidFunction;
      return new Promise<void>((resolve, reject) => {
        transfer.on(
          'error',
          (errorListener = (err) => {
            reject(err);
          })
        );
        transfer.on(
          'end',
          (endListener = () => {
            this.installRemote(serial, temp, options, args)
              .then(resolve)
              .catch(reject);
          })
        );
      })
        .finally(() => {
          transfer.removeListener('error', errorListener);
          return transfer.removeListener('end', endListener);
        })
        .nodeify(cb);
    });
  }

  uninstall(
    serial: string,
    pkg: string,
    cb?: (err: Error) => void
  ): Promise<void>;
  uninstall(
    serial: string,
    pkg: string,
    options?: UninstallOptions,
    cb?: (err: Error) => void
  ): Promise<void>;
  uninstall(
    serial: string,
    pkg: string,
    options?: any,
    cb?: (err: Error) => void
  ) {
    if (typeof options === 'function') {
      cb = options;
      options = undefined;
    }
    return this.connection()
      .then((conn) => {
        return new UninstallCommand(conn).execute(serial, pkg, options);
      })
      .nodeify(cb);
  }

  isInstalled(
    serial: string,
    pkg: string,
    cb?: (err: Error, value: boolean) => void
  ) {
    return this.connection()
      .then((conn) => {
        return new IsInstalledCommand(conn).execute(serial, pkg);
      })
      .nodeify(cb);
  }

  startActivity(
    serial: string,
    pkg: string,
    activity: string,
    cb?: (err: Error) => void
  ): Promise<void>;
  startActivity(
    serial: string,
    pkg: string,
    activity: string,
    options?: StartActivityOptions,
    cb?: (err: Error) => void
  ): Promise<void>;
  startActivity(
    serial: string,
    pkg: string,
    activity: string,
    options?: any,
    cb?: (err: Error) => void
  ) {
    if (typeof options === 'function') {
      cb = options;
      options = undefined;
    }
    return this.connection()
      .then((conn) => {
        return new StartActivityCommand(conn).execute(
          serial,
          pkg,
          activity,
          options
        );
      })
      .nodeify(cb);
  }

  startService(
    serial: string,
    pkg: string,
    service: string,
    cb?: (err: Error) => void
  );
  startService(
    serial: string,
    pkg: string,
    service: string,
    options?: StartServiceOptions,
    cb?: (err: Error) => void
  ): Promise<void>;
  startService(
    serial: string,
    pkg: string,
    service: string,
    options?: any,
    cb?: (err: Error) => void
  ) {
    if (typeof options === 'function') {
      cb = options;
      options = undefined;
    }
    return this.connection()
      .then((conn) => {
        return new StartServiceCommand(conn).execute(
          serial,
          pkg,
          service,
          options
        );
      })
      .nodeify(cb);
  }

  stat(serial: string, path: string, cb?: (err: Error, value: Stats) => void) {
    return this.syncService(serial)
      .then((sync) => {
        return sync.stat(path).finally(() => {
          return sync.end();
        });
      })
      .nodeify(cb);
  }

  readDir(
    serial: string,
    path: string,
    cb?: (err: Error, value: SyncEntry[]) => void
  ) {
    return this.syncService(serial)
      .then((sync) => {
        return sync.readDir(path).finally(() => {
          return sync.end();
        });
      })
      .nodeify(cb);
  }

  pull(
    serial: string,
    path: string,
    cb?: (err: Error, value: PullTransfer) => void
  ) {
    return this.syncService(serial)
      .then((sync) => {
        return sync.pull(path).on('end', () => {
          sync.end();
        });
      })
      .nodeify(cb);
  }

  push(
    serial: string,
    srcPath: string | Readable,
    destPath: string,
    cb?: (err: Error, value: PushTransfer) => void
  ): Promise<PushTransfer>;
  push(
    serial: string,
    srcPath: string | Readable,
    destPath: string,
    mode?: SyncMode,
    cb?: (err: Error, value: PushTransfer) => void
  ): Promise<PushTransfer>;
  push(
    serial: string,
    srcPath: string | Readable,
    destPath: string,
    mode?: any,
    cb?: (err: Error, value: PushTransfer) => void
  ) {
    if (typeof mode === 'function') {
      cb = mode;
      mode = undefined;
    }
    return this.syncService(serial)
      .then((sync) => {
        return sync.push(srcPath, destPath, mode).on('end', () => {
          sync.end();
        });
      })
      .nodeify(cb);
  }

  tcpip(
    serial: string,
    cb?: (err: Error, value: string) => void
  ): Promise<string>;
  tcpip(
    serial: string,
    port: number,
    cb?: (err: Error, value: string) => void
  ): Promise<string>;
  tcpip(serial: string, port: any, cb?: (err: Error, value: string) => void) {
    if (typeof port === 'function') {
      cb = port;
      port = 5555;
    }
    return this.connection()
      .then((conn) => {
        return new TcpIpCommand(conn).execute(serial, port, this.options.host);
      })
      .nodeify(cb);
  }

  usb(serial: string, cb?: (err: Error) => void) {
    return this.connection()
      .then((conn) => {
        return new UsbCommand(conn).execute(serial);
      })
      .nodeify(cb);
  }

  waitBootComplete(serial: string, cb?: (err: Error) => void) {
    return this.connection()
      .then((conn) => {
        return new WaitBootCompleteCommand(conn).execute(serial);
      })
      .nodeify(cb);
  }

  waitForDevice(
    tranport: TransportType,
    state: WaitForState,
    cb?: (err: Error) => void
  ) {
    return this.connection()
      .then((conn) => {
        return new WaitForDeviceCommand(conn).execute(tranport, state);
      })
      .nodeify(cb);
  }

  map<R>(mapper: (device: AdbDevice) => R): Promise<R[]> {
    return this.listDevices().then((devices) => {
      return Promise.map(devices, (device) => {
        return mapper(new AdbDevice(this, device));
      });
    });
  }

  private pushInternal(serial: string, data: any, dest: string): Promise<void> {
    return this.push(serial, data, `${dest}`).then((transfer) => {
      return new Promise((resolve, reject) => {
        transfer.on('end', () => {
          return resolve();
        });
        transfer.on('error', reject);
      });
    });
  }

  pushDataToFile(
    serial: string,
    data: string,
    destPath: string,
    cb?: (err: Error) => void
  ) {
    return this.pushInternal(
      serial,
      stringToStreamfrom(data),
      destPath
    ).nodeify(cb);
  }

  pushFile(
    serial: string,
    srcPath: string,
    destPath: string,
    cb?: (err: Error) => void
  ) {
    return this.pushInternal(serial, srcPath, destPath).nodeify(cb);
  }

  pullDataFromFile(
    serial: string,
    srcPath: string,
    cb?: (err: Error, value: string) => void
  ): Promise<string> {
    return this.pull(serial, `${srcPath}`)
      .then(
        (transfer: PullTransfer): Promise<string> => {
          return new Promise((resolve, reject) => {
            let data = '';
            transfer.on('data', (chunk) => {
              data += chunk.toString();
            });
            transfer.on('end', () => {
              resolve(data);
            });
            transfer.on('error', reject);
          });
        }
      )
      .nodeify(cb);
  }

  pullFile(
    serial: string,
    srcPath: string,
    destPath: string,
    cb?: (err: Error) => void
  ): Promise<void> {
    return this.pull(serial, `${srcPath}`)
      .then(
        (transfer: PullTransfer): Promise<void> => {
          return new Promise((resolve, reject) => {
            transfer.on('end', resolve);
            transfer.on('error', reject);
            transfer.pipe(fs.createWriteStream(destPath));
          });
        }
      )
      .nodeify(cb);
  }

  setProp(
    serial: string,
    prop: string,
    value: SimpleType,
    cb?: (err: Error) => void
  ): Promise<void> {
    return this.connection()
      .then((conn) => {
        return new SetProp(conn).execute(serial, prop, value);
      })
      .nodeify(cb);
  }

  getProp(
    serial: string,
    prop: string,
    cb?: (err: Error, value: SimpleType) => void
  ) {
    return this.connection()
      .then((conn) => {
        return new GetPropertyCommand(conn).execute(serial, prop);
      })
      .nodeify(cb);
  }

  putSetting(
    serial: string,
    mode: SettingsMode,
    name: string,
    value: SimpleType,
    cb?: (err: Error) => void
  ) {
    return this.connection()
      .then((conn) => {
        return new PutSetting(conn).execute(serial, mode, name, value);
      })
      .nodeify(cb);
  }

  listSettings(
    serial: string,
    mode: SettingsMode,
    cb?: (err: Error, value: KeyStringObject[]) => void
  ) {
    return this.connection()
      .then((conn) => {
        return new ListSettingsCommand(conn).execute(serial, mode);
      })
      .nodeify(cb);
  }

  getSetting(
    serial: string,
    mode: SettingsMode,
    name: string,
    cb?: (err: Error, value: SimpleType) => void
  ) {
    return this.connection()
      .then((conn) => {
        return new GetSetting(conn).execute(serial, mode, name);
      })
      .nodeify(cb);
  }

  shell(
    serial: string,
    command: string | string[],
    cb?: (err: Error, value: SimpleType) => void
  ) {
    return this.connection()
      .then((conn) => {
        return new ShellCommand(conn).execute(serial, command);
      })
      .nodeify(cb);
  }

  custom<T>(
    CustomCommand: CommandConstruct,
    cb?: (err: Error, value: T) => void
  ): Promise<T> {
    return this.connection()
      .then((conn) => {
        return new CustomCommand(conn).execute();
      })
      .nodeify(cb);
  }

  customTransport<T>(
    CustomCommand: CommandConstruct,
    serial: string,
    cb?: (err: Error, value: T) => void
  ): Promise<T> {
    return this.connection()
      .then((conn) => {
        return new CustomCommand(conn).execute(serial);
      })
      .nodeify(cb);
  }

  openMonkey(serial: string, cb?: (err: Error, value: Monkey) => void) {
    const tryConnect = (times: number): Promise<Monkey> => {
      return this.openTcp(serial, 1080)
        .then((stream) => {
          return new Monkey().connect(stream as any);
        })
        .catch((err) => {
          if ((times -= 1)) {
            return Promise.delay(100).then(() => {
              return tryConnect(times);
            });
          } else {
            throw err;
          }
        });
    };
    return tryConnect(1)
      .catch((err) => {
        return this.transport(serial)
          .then((transport) => {
            return new MonkeyCommand(transport).execute(serial, 1080);
          })
          .then((out) => {
            return tryConnect(20).then((monkey) => {
              return monkey.once('end', () => {
                return out.end();
              });
            });
          });
      })
      .nodeify(cb);
  }

  killApp(serial: string, pkg: string, cb?: (err: Error) => void) {
    this.shell(serial, `am force-stop ${pkg}`).return().nodeify(cb);
  }

  private execInternal(...args: ReadonlyArray<string>) {
    return new Promise<string>((resolve, reject) => {
      exec(`${this.options.bin} ${args.join(' ')}`, (err, stdout, stderr) => {
        if (err) return reject(err);
        else if (stderr) return reject(new Error(stderr.trim()));
        else if (/Error/.test(stdout)) return reject(new Error(stdout.trim()));
        else return resolve(stdout);
      });
    });
  }

  exec(cmd: string, cb?: (err: Error, value: string) => void) {
    return this.execInternal(cmd).nodeify(cb);
  }

  execDevice(
    serial: string,
    cmd: string,
    cb?: (err: Error, value: string) => void
  ) {
    return this.execInternal(...['-s', serial, cmd]).nodeify(cb);
  }

  execDeviceShell(
    serial: string,
    cmd: string,
    cb?: (err: Error, value: string) => void
  ) {
    return this.execInternal(...['-s', serial, 'shell', cmd]).nodeify(cb);
  }

  batteryStatus(
    serial: string,
    cb?: (err: Error, value: KeyStringObject) => void
  ) {
    return this.connection()
      .then((conn) => {
        return new BatteryStatusCommand(conn).execute(serial);
      })
      .nodeify(cb);
  }
}
