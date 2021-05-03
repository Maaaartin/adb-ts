import Promise from 'bluebird';
import Jimp from 'jimp';
import { Readable } from 'stream';
import {
  CommandConstruct,
  CpOptions,
  DeviceState,
  ForwardsObject,
  IAdbDevice,
  InputOptions,
  InputSource,
  InstallOptions,
  KeyStringObject,
  LogcatOptions,
  MkDirOptions,
  MvOptions,
  ReversesObject,
  RmOption,
  SettingsMode,
  SimpleType,
  StartActivityOptions,
  StartServiceOptions,
  TouchOptions,
  TransportType,
  UninstallOptions,
} from '.';
import AdbClient from './client';
import Connection from './connection';
import FileStats from './filestats';
import { KeyCode } from './keycode';
import LogcatReader from './logcat/reader';
import Monkey from './monkey/client';
import { SyncMode } from './sync';
import SyncEntry from './sync/entry';
import PullTransfer from './sync/pulltransfer';
import PushTransfer from './sync/pushtransfer';
import Stats from './sync/stats';

export default class AdbDevice implements IAdbDevice {
  id: string;
  state: DeviceState;
  path: string;
  device: string;
  model: string;
  product: string;
  transportId?: string;
  transport: TransportType;
  private client: AdbClient;

  constructor(client: AdbClient, props?: IAdbDevice) {
    Object.assign(this, props || {});
    this.client = client;
  }

  getSerialNo(cb?: (err: Error, value: string) => void) {
    return this.client.getSerialNo(this.id, cb);
  }

  getDevicePath(cb?: (err: Error, value: string) => void) {
    return this.client.getDevicePath(this.id, cb);
  }

  listProperties(cb?: (err: Error, value: KeyStringObject) => void) {
    return this.client.listProperties(this.id, cb);
  }

  listFeatures(cb?: (err: Error, value: KeyStringObject) => void) {
    return this.client.listFeatures(this.id, cb);
  }

  listPackages(cb?: (err: Error, value: string[]) => void) {
    return this.client.listPackages(this.id, cb);
  }

  getIpAddress(cb?: (err: Error, value?: string) => void) {
    return this.client.getIpAddress(this.id, cb);
  }

  forward(local: string, remote: string, cb?: (err: Error) => void) {
    return this.client.forward(this.id, local, remote, cb);
  }

  listForwards(cb?: (err: Error, value: ForwardsObject[]) => void) {
    return this.client.listForwards(this.id, cb);
  }

  reverse(local: string, remote: string, cb?: (err: Error) => void) {
    return this.client.reverse(this.id, local, remote, cb);
  }

  listReverses(cb?: (err: Error, value: ReversesObject[]) => void) {
    return this.client.listReverses(this.id, cb);
  }

  shell(command: string | string[], cb?: (err: Error, value: string) => void) {
    return this.client.shell(this.id, command, cb);
  }

  reboot(cb?: (err: Error) => void) {
    return this.client.reboot(this.id, cb);
  }

  shutdown(cb?: (err: Error) => void) {
    return this.client.shutdown(this.id, cb);
  }

  remount(cb?: (err: Error) => void) {
    return this.client.remount(this.id, cb);
  }

  root(cb?: (err: Error) => void) {
    return this.client.root(this.id, cb);
  }

  screenshot(cb?: (err: Error, value: Jimp) => void) {
    return this.client.screenshot(this.id, cb);
  }

  openTcp(
    port: number | string,
    cb?: (err: Error, value: Connection) => void
  ): Promise<Connection>;
  openTcp(
    port: number | string,
    host?: string,
    cb?: (err: Error, value: Connection) => void
  ): Promise<Connection>;
  openTcp(
    port: number | string,
    host?: any,
    cb?: (err: Error, value: Connection) => void
  ) {
    return this.client.openTcp(this.id, port, host, cb);
  }

  openLogcat(
    cb?: (err: Error, value: LogcatReader) => void
  ): Promise<LogcatReader>;
  openLogcat(
    options?: LogcatOptions,
    cb?: (err: Error, value: LogcatReader) => void
  ): Promise<LogcatReader>;
  openLogcat(options?: any, cb?: (err: Error, value: LogcatReader) => void) {
    return this.client.openLogcat(this.id, options, cb);
  }

  clear(pkg: string, cb?: (err: Error) => void) {
    return this.client.clear(this.id, pkg, cb);
  }

  install(apk: string | Readable, cb?: (err: Error) => void): Promise<void>;
  install(
    apk: string | Readable,
    options?: InstallOptions,
    cb?: (err: Error) => void
  ): Promise<void>;
  install(
    apk: string | Readable,
    options?: InstallOptions,
    args?: string,
    cb?: (err: Error) => void
  ): Promise<void>;
  install(
    apk: string | Readable,
    options?: any,
    args?: any,
    cb?: (err: Error) => void
  ) {
    return this.client.install(this.id, apk, options, args, cb);
  }
  uninstall(pkg: string, cb?: (err: Error) => void): Promise<void>;
  uninstall(
    pkg: string,
    options?: UninstallOptions,
    cb?: (err: Error) => void
  ): Promise<void>;
  uninstall(pkg: string, options?: any, cb?: (err: Error) => void) {
    return this.client.uninstall(this.id, pkg, options, cb);
  }

  isInstalled(pkg: string, cb?: (err: Error, value: boolean) => void) {
    return this.client.isInstalled(this.id, pkg, cb);
  }

  startActivity(
    pkg: string,
    activity: string,
    cb?: (err: Error) => void
  ): Promise<void>;
  startActivity(
    pkg: string,
    activity: string,
    options?: StartActivityOptions,
    cb?: (err: Error) => void
  ): Promise<void>;
  startActivity(
    pkg: string,
    activity: string,
    options?: any,
    cb?: (err: Error) => void
  ) {
    return this.client.startActivity(this.id, pkg, activity, options, cb);
  }

  startService(pkg: string, service: string, cb?: (err: Error) => void);
  startService(
    pkg: string,
    service: string,
    options?: StartServiceOptions,
    cb?: (err: Error) => void
  ): Promise<void>;
  startService(
    pkg: string,
    service: string,
    options?: any,
    cb?: (err: Error) => void
  ) {
    return this.client.startService(this.id, pkg, service, options, cb);
  }

  stat(path: string, cb?: (err: Error, value: Stats) => void) {
    return this.client.stat(this.id, path, cb);
  }

  readDir(path: string, cb?: (err: Error, value: SyncEntry[]) => void) {
    return this.client.readDir(this.id, path, cb);
  }

  pushDataToFile(data: string, destPath: string, cb?: (err: Error) => void) {
    return this.client.pushDataToFile(this.id, data, destPath, cb);
  }

  pushFile(srcPath: string, destPath: string, cb?: (err: Error) => void) {
    return this.client.pushFile(this.id, srcPath, destPath, cb);
  }

  pullDataFromFile(srcPath: string, cb?: (err: Error, value: string) => void) {
    return this.client.pullDataFromFile(this.id, srcPath, cb);
  }

  pullFile(srcPath: string, destPath: string, cb?: (err: Error) => void) {
    return this.client.pullFile(this.id, srcPath, destPath, cb);
  }

  pull(path: string, cb?: (err: Error, value: PullTransfer) => void) {
    return this.client.pull(this.id, path, cb);
  }

  push(
    srcPath: string | Readable,
    destPath: string,
    cb?: (err: Error, value: PushTransfer) => void
  ): Promise<PushTransfer>;
  push(
    srcPath: string | Readable,
    destPath: string,
    mode?: SyncMode,
    cb?: (err: Error, value: PushTransfer) => void
  ): Promise<PushTransfer>;
  push(
    srcPath: string | Readable,
    destPath: string,
    mode?: any,
    cb?: (err: Error, value: PushTransfer) => void
  ) {
    return this.client.push(this.id, srcPath, destPath, mode, cb);
  }

  tcpip(port = 5555, cb?: (err: Error, value: string) => void) {
    return this.client.tcpip(this.id, port, cb);
  }

  usb(cb?: (err: Error) => void) {
    return this.client.usb(this.id, cb);
  }

  waitBootComplete(cb?: (err: Error) => void) {
    return this.client.waitBootComplete(this.id, cb);
  }

  listSettings(
    mode: SettingsMode,
    cb?: (err: Error, value: KeyStringObject[]) => void
  ) {
    return this.client.listSettings(this.id, mode, cb);
  }

  getProp(prop: string, cb?: (err: Error, value: SimpleType) => void) {
    return this.client.getProp(this.id, prop, cb);
  }

  setProp(
    prop: string,
    value: SimpleType,
    cb?: (err: Error) => void
  ): Promise<void> {
    return this.client.setProp(this.id, prop, value, cb);
  }

  getSetting(
    mode: SettingsMode,
    name: string,
    cb?: (err: Error, value: SimpleType) => void
  ) {
    return this.client.getSetting(this.id, mode, name, cb);
  }

  putSetting(
    mode: SettingsMode,
    name: string,
    value: SimpleType,
    cb?: (err: Error) => void
  ) {
    return this.client.putSetting(this.id, mode, name, value, cb);
  }

  tap(x: number, y: number, cb?: (err: Error) => void): Promise<void>;
  tap(
    x: number,
    y: number,
    source: InputSource,
    cb?: (err: Error) => void
  ): Promise<void>;
  tap(x: number, y: number, source: any, cb?: (err: Error) => void) {
    return this.client.tap(this.id, x, y, source, cb);
  }

  text(text: SimpleType, cb?: (err: Error) => void): Promise<void>;
  text(
    text: SimpleType,
    source: InputSource,
    cb?: (err: Error) => void
  ): Promise<void>;
  text(text: SimpleType, source: any, cb?: (err: Error) => void) {
    return this.client.text(this.id, text, source, cb);
  }

  keyEvent(code: KeyCode | number, cb?: (err: Error) => void): Promise<void>;
  keyEvent(
    code: KeyCode | number,
    options?: InputOptions & { longpress?: boolean },
    cb?: (err: Error) => void
  ): Promise<void>;
  keyEvent(code: KeyCode | number, options?: any, cb?: (err: Error) => void) {
    return this.client.keyEvent(this.id, code, options, cb);
  }

  swipe(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    cb?: (err: Error) => void
  ): Promise<void>;
  swipe(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options?: InputOptions & { duration?: number },
    cb?: (err: Error) => void
  ): Promise<void>;
  swipe(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options?: any,
    cb?: (err: Error) => void
  ) {
    return this.client.swipe(this.id, x1, y1, x2, y2, options, cb);
  }

  dragAndDrop(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    cb?: (err: Error) => void
  ): Promise<void>;
  dragAndDrop(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options?: InputOptions & { duration?: number },
    cb?: (err: Error) => void
  ): Promise<void>;
  dragAndDrop(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options?: any,
    cb?: (err: Error) => void
  ) {
    return this.client.dragAndDrop(this.id, x1, y1, x2, y2, options, cb);
  }

  press(cb?: (err: Error) => void): Promise<void>;
  press(source?: InputSource, cb?: (err: Error) => void): Promise<void>;
  press(source: any, cb?: (err: Error) => void) {
    return this.client.press(this.id, source, cb);
  }

  roll(x: number, y: number, cb?: (err: Error) => void): Promise<void>;
  roll(
    x: number,
    y: number,
    source?: InputSource,
    cb?: (err: Error) => void
  ): Promise<void>;
  roll(x: number, y: number, source: any, cb?: (err: Error) => void) {
    return this.client.roll(this.id, x, y, source, cb);
  }

  custom<T>(
    CustomCommand: CommandConstruct,
    cb?: (err: Error, value: T) => void
  ) {
    return this.client.customTransport<T>(CustomCommand, this.id, cb);
  }

  openMonkey(cb?: (err: Error, value: Monkey) => void) {
    return this.client.openMonkey(this.id, cb);
  }

  killApp(pkg: string, cb?: (err: Error) => void) {
    return this.client.killApp(this.id, pkg, cb);
  }

  exec(cmd: string, cb?: (err: Error, value: string) => void) {
    return this.client.execDevice(this.id, cmd, cb);
  }

  execShell(cmd: string, cb?: (err: Error, value: string) => void) {
    return this.client.execDeviceShell(this.id, cmd, cb);
  }

  batteryStatus(cb?: (err: Error, value: KeyStringObject) => void) {
    return this.client.batteryStatus(this.id, cb);
  }

  rm(
    path: string,
    cb?: (err: Error | null, value: string) => void
  ): Promise<string>;
  rm(
    path: string,
    options?: RmOption,
    cb?: (err: Error | null, value: string) => void
  ): Promise<string>;
  rm(
    path: string,
    options?: any,
    cb?: (err: Error | null, value: string) => void
  ) {
    return this.client.rm(this.id, path, options, cb);
  }

  mkdir(
    path: string,
    cb?: (err: Error | null, value: string) => void
  ): Promise<string>;
  mkdir(
    path: string,
    options?: MkDirOptions,
    cb?: (err: Error | null, value: string) => void
  ): Promise<string>;
  mkdir(
    path: string,
    options?: any,
    cb?: (err: Error | null, value: string) => void
  ) {
    return this.client.mkdir(this.id, path, options, cb);
  }

  touch(
    path: string,
    cb?: (err: Error | null, value: string) => void
  ): Promise<string>;
  touch(
    path: string,
    options?: TouchOptions,
    cb?: (err: Error | null, value: string) => void
  ): Promise<string>;
  touch(
    path: string,
    options?: any,
    cb?: (err: Error | null, value: string) => void
  ) {
    return this.client.touch(this.id, path, options, cb);
  }

  mv(
    srcPath: string,
    destPath: string,
    cb?: (err: Error | null, value: string) => void
  ): Promise<string>;
  mv(
    srcPath: string,
    destPath: string,
    options?: MvOptions,
    cb?: (err: Error | null, value: string) => void
  ): Promise<string>;
  mv(
    srcPath: string,
    destPath: string,
    options?: any,
    cb?: (err: Error | null, value: string) => void
  ) {
    return this.client.mv(this.id, srcPath, destPath, options, cb);
  }

  cp(
    srcPath: string,
    destPath: string,
    cb?: (err: Error | null, value: string) => void
  ): Promise<string>;
  cp(
    srcPath: string,
    destPath: string,
    options?: CpOptions,
    cb?: (err: Error | null, value: string) => void
  ): Promise<string>;
  cp(
    srcPath: string,
    destPath: string,
    options?: any,
    cb?: (err: Error | null, value: string) => void
  ) {
    return this.client.cp(this.id, srcPath, destPath, options, cb);
  }

  fileStat(path: string, cb?: (err: Error | null, value: FileStats) => void) {
    return this.client.fileStat(this.id, path, cb);
  }
}
