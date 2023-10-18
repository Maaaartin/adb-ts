import {
    TransportCommandConstruct,
    CpOptions,
    DeviceState,
    ForwardsObject,
    IDevice,
    InputSource,
    InstallOptions,
    LogcatOptions,
    MkDirOptions,
    MvOptions,
    ReversesObject,
    RmOptions,
    SettingsMode,
    PrimitiveType,
    StartActivityOptions,
    StartServiceOptions,
    TouchOptions,
    TransportType,
    UninstallOptions,
    PropertyMap,
    PropertyValue,
    KeyEventOptions,
    InputDurationOptions,
    NonEmptyArray
} from './util';
import { Client } from './client';
import { Connection } from './connection';
import { FileStat } from './filestats';
import { KeyCode } from './util/keycode';
import { LogcatReader } from './logcat/reader';
import { Monkey } from './monkey/client';
import { PullTransfer } from './sync/pulltransfer';
import { PushTransfer } from './sync/pushtransfer';
import { Readable } from 'stream';
import SyncEntry from './sync/entry';
import { SyncMode } from './sync';

export class Device implements IDevice {
    public readonly id: string;
    public readonly state: DeviceState;
    public readonly path: string | undefined;
    public readonly device: string | undefined;
    public readonly model: string | undefined;
    public readonly product: string | undefined;
    public readonly transportId: string;
    public readonly transport: TransportType;
    private readonly client: Client;

    constructor(client: Client, props: IDevice) {
        this.client = client;
        this.id = props.id;
        this.state = props.state;
        this.path = props.path;
        this.device = props.device;
        this.model = props.model;
        this.product = props.product;
        this.transportId = props.transportId;
        this.transport = props.transport;
    }

    public getSerialNo(): Promise<string> {
        return this.client.getSerialNo(this.id);
    }

    public getDevicePath(): Promise<string> {
        return this.client.getDevicePath(this.id);
    }

    public listProperties(): Promise<PropertyMap> {
        return this.client.listProperties(this.id);
    }

    public listFeatures(): Promise<PropertyMap> {
        return this.client.listFeatures(this.id);
    }

    public listPackages(): Promise<string[]> {
        return this.client.listPackages(this.id);
    }

    public getIpAddress(): Promise<string[]> {
        return this.client.getIpAddress(this.id);
    }

    public forward(local: string, remote: string): Promise<void> {
        return this.client.forward(this.id, local, remote);
    }

    public listForwards(): Promise<ForwardsObject[]> {
        return this.client.listForwards(this.id);
    }

    public reverse(local: string, remote: string): Promise<void> {
        return this.client.reverse(this.id, local, remote);
    }

    public listReverses(): Promise<ReversesObject[]> {
        return this.client.listReverses(this.id);
    }

    public shell(command: string): Promise<string> {
        return this.client.shell(this.id, command);
    }

    public reboot(): Promise<void> {
        return this.client.reboot(this.id);
    }

    public shutdown(): Promise<void> {
        return this.client.shutdown(this.id);
    }

    public remount(): Promise<void> {
        return this.client.remount(this.id);
    }

    public root(): Promise<void> {
        return this.client.root(this.id);
    }

    public screenshot(): Promise<Buffer> {
        return this.client.screenshot(this.id);
    }

    public openTcp(port: number, host?: string): Promise<Connection> {
        return this.client.openTcp(this.id, port, host as string);
    }

    public openLogcat(options?: LogcatOptions): Promise<LogcatReader> {
        return this.client.openLogcat(this.id, options as LogcatOptions);
    }

    public clear(pkg: string): Promise<void> {
        return this.client.clear(this.id, pkg);
    }

    public install(apk: string | Readable): Promise<void>;
    public install(
        apk: string | Readable,
        options?: InstallOptions
    ): Promise<void>;
    public install(
        apk: string | Readable,
        options?: InstallOptions,
        args?: string
    ): Promise<void>;
    public install(
        apk: string | Readable,
        options?: InstallOptions,
        args?: string
    ): Promise<void> {
        return this.client.install(
            this.id,
            apk,
            options as InstallOptions,
            args as string
        );
    }

    public uninstall(pkg: string, options?: UninstallOptions): Promise<void> {
        return this.client.uninstall(this.id, pkg, options as UninstallOptions);
    }

    public isInstalled(pkg: string): Promise<boolean> {
        return this.client.isInstalled(this.id, pkg);
    }

    public startActivity(
        pkg: string,
        activity: string,
        options?: StartActivityOptions
    ): Promise<void> {
        return this.client.startActivity(
            this.id,
            pkg,
            activity,
            options as StartActivityOptions
        );
    }

    public startService(
        pkg: string,
        service: string,
        options?: StartServiceOptions
    ): Promise<void> {
        return this.client.startService(
            this.id,
            pkg,
            service,
            options as StartActivityOptions
        );
    }

    public readDir(path: string): Promise<SyncEntry[]> {
        return this.client.readDir(this.id, path);
    }

    public pushDataToFile(
        data: string | Buffer | Readable,
        destPath: string
    ): Promise<void> {
        return this.client.pushDataToFile(this.id, data, destPath);
    }

    public pushFile(srcPath: string, destPath: string): Promise<void> {
        return this.client.pushFile(this.id, srcPath, destPath);
    }

    public pullDataFromFile(srcPath: string): Promise<Buffer> {
        return this.client.pullDataFromFile(this.id, srcPath);
    }

    public pullFile(srcPath: string, destPath: string): Promise<void> {
        return this.client.pullFile(this.id, srcPath, destPath);
    }

    public pull(path: string): Promise<PullTransfer> {
        return this.client.pull(this.id, path);
    }

    public push(
        srcPath: string | Readable,
        destPath: string,
        mode?: SyncMode
    ): Promise<PushTransfer> {
        return this.client.push(this.id, srcPath, destPath, mode as SyncMode);
    }

    public tcpip(port = 5555): Promise<void> {
        return this.client.tcpip(this.id, port);
    }

    public usb(): Promise<void> {
        return this.client.usb(this.id);
    }

    public waitBootComplete(): Promise<void> {
        return this.client.waitBootComplete(this.id);
    }

    public listSettings(mode: SettingsMode): Promise<PropertyMap> {
        return this.client.listSettings(this.id, mode);
    }

    public getProp(prop: string): Promise<PropertyValue> {
        return this.client.getProp(this.id, prop);
    }

    public setProp(prop: string, value: PrimitiveType): Promise<void> {
        return this.client.setProp(this.id, prop, value);
    }

    public getSetting(
        mode: SettingsMode,
        name: string
    ): Promise<PropertyValue> {
        return this.client.getSetting(this.id, mode, name);
    }

    public putSetting(
        mode: SettingsMode,
        name: string,
        value: PrimitiveType
    ): Promise<void> {
        return this.client.putSetting(this.id, mode, name, value);
    }

    public tap(x: number, y: number, source?: InputSource): Promise<void> {
        return this.client.tap(this.id, x, y, source as InputSource);
    }

    public text(text: string, source?: InputSource): Promise<void> {
        return this.client.text(this.id, text, source as InputSource);
    }

    public keyEvent(
        code: KeyCode | number | NonEmptyArray<number | KeyCode>,
        options?: KeyEventOptions
    ): Promise<void> {
        return this.client.keyEvent(this.id, code, options as KeyEventOptions);
    }

    public swipe(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options?: InputDurationOptions
    ): Promise<void> {
        return this.client.swipe(
            this.id,
            x1,
            y1,
            x2,
            y2,
            options as InputDurationOptions
        );
    }

    public dragAndDrop(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options?: InputDurationOptions
    ): Promise<void> {
        return this.client.dragAndDrop(
            this.id,
            x1,
            y1,
            x2,
            y2,
            options as InputDurationOptions
        );
    }

    public press(source?: InputSource): Promise<void> {
        return this.client.press(this.id, source as InputSource);
    }

    public roll(x: number, y: number, source?: InputSource): Promise<void> {
        return this.client.roll(this.id, x, y, source as InputSource);
    }

    public custom<T, P extends unknown[] = unknown[]>(
        CustomCommand: TransportCommandConstruct<T, P>,
        ...args: P
    ): Promise<T> {
        return this.client.customTransport<T, P>(
            CustomCommand,
            this.id,
            ...args
        );
    }

    public openMonkey(): Promise<Monkey> {
        return this.client.openMonkey(this.id);
    }

    public killApp(pkg: string): Promise<void> {
        return this.client.killApp(this.id, pkg);
    }

    public exec(cmd: string): Promise<string> {
        return this.client.execDevice(this.id, cmd);
    }

    public execShell(cmd: string): Promise<string> {
        return this.client.execDeviceShell(this.id, cmd);
    }

    public batteryStatus(): Promise<PropertyMap> {
        return this.client.batteryStatus(this.id);
    }

    public rm(path: string, options?: RmOptions): Promise<void> {
        return this.client.rm(this.id, path, options as RmOptions);
    }

    public mkdir(path: string, options?: MkDirOptions): Promise<void> {
        return this.client.mkdir(this.id, path, options as MkDirOptions);
    }

    public touch(path: string, options?: TouchOptions): Promise<void> {
        return this.client.touch(this.id, path, options as TouchOptions);
    }

    public mv(
        srcPath: string,
        destPath: string,
        options?: MvOptions
    ): Promise<void> {
        return this.client.mv(this.id, srcPath, destPath, options as MvOptions);
    }

    public cp(
        srcPath: string,
        destPath: string,
        options?: CpOptions
    ): Promise<void> {
        return this.client.cp(this.id, srcPath, destPath, options as CpOptions);
    }

    public fileStat(path: string): Promise<FileStat> {
        return this.client.fileStat(this.id, path);
    }
}
