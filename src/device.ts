import {
    TransportCommandConstruct,
    CpOptions,
    DeviceState,
    ForwardsObject,
    IAdbDevice,
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
    ExecCallbackWithValue,
    PropertyValue,
    KeyEventOptions,
    InputDurationOptions,
    NonEmptyArray
} from './util/types';
import { AdbClient } from './client';
import Connection from './connection';
import FileStat from './filestats';
import { KeyCode } from './keycode';
import { LogcatReader } from './logcat/reader';
import Monkey from './monkey/client';
import { PullTransfer } from './sync/pulltransfer';
import { PushTransfer } from './sync/pushtransfer';
import { Readable } from 'stream';
import SyncEntry from './sync/entry';
import { SyncMode } from './sync';

export default class AdbDevice implements IAdbDevice {
    readonly id: string;
    readonly state: DeviceState;
    readonly path: string | undefined;
    readonly device: string | undefined;
    readonly model: string | undefined;
    readonly product: string | undefined;
    readonly transportId: string;
    readonly transport: TransportType;
    private client: AdbClient;

    constructor(client: AdbClient, props: IAdbDevice) {
        this.id = props.id;
        this.state = props.state;
        this.path = props.path;
        this.device = props.device;
        this.model = props.model;
        this.product = props.product;
        this.transportId = props.transportId;
        this.transport = props.transport;
        this.client = client;
    }

    getSerialNo(): Promise<string> {
        return this.client.getSerialNo(this.id);
    }

    getDevicePath(): Promise<string> {
        return this.client.getDevicePath(this.id);
    }

    listProperties(): Promise<PropertyMap> {
        return this.client.listProperties(this.id);
    }

    listFeatures(): Promise<PropertyMap> {
        return this.client.listFeatures(this.id);
    }

    listPackages(): Promise<string[]> {
        return this.client.listPackages(this.id);
    }

    getIpAddress(): Promise<string | string[] | null> {
        return this.client.getIpAddress(this.id);
    }

    forward(local: string, remote: string): Promise<void> {
        return this.client.forward(this.id, local, remote);
    }

    listForwards(): Promise<ForwardsObject[]> {
        return this.client.listForwards(this.id);
    }

    reverse(local: string, remote: string): Promise<void> {
        return this.client.reverse(this.id, local, remote);
    }

    listReverses(): Promise<ReversesObject[]> {
        return this.client.listReverses(this.id);
    }

    shell(command: string): Promise<string> {
        return this.client.shell(this.id, command);
    }

    reboot(): Promise<void> {
        return this.client.reboot(this.id);
    }

    shutdown(): Promise<void> {
        return this.client.shutdown(this.id);
    }

    remount(): Promise<void> {
        return this.client.remount(this.id);
    }

    root(): Promise<void> {
        return this.client.root(this.id);
    }

    screenshot(): Promise<Buffer> {
        return this.client.screenshot(this.id);
    }

    openTcp(port: number | string, host?: string): Promise<Connection> {
        return this.client.openTcp(this.id, port, host as string);
    }

    openLogcat(options?: LogcatOptions): Promise<LogcatReader> {
        return this.client.openLogcat(this.id, options as LogcatOptions);
    }

    clear(pkg: string): Promise<void> {
        return this.client.clear(this.id, pkg);
    }

    install(apk: string | Readable): Promise<void>;
    install(apk: string | Readable, options?: InstallOptions): Promise<void>;
    install(
        apk: string | Readable,
        options?: InstallOptions,
        args?: string
    ): Promise<void>;
    install(
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

    uninstall(pkg: string, options?: UninstallOptions): Promise<void> {
        return this.client.uninstall(this.id, pkg, options as UninstallOptions);
    }

    isInstalled(pkg: string): Promise<boolean> {
        return this.client.isInstalled(this.id, pkg);
    }

    startActivity(
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

    startService(
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

    readDir(path: string): Promise<SyncEntry[]> {
        return this.client.readDir(this.id, path);
    }

    pushDataToFile(
        data: string | Buffer | Readable,
        destPath: string
    ): Promise<void> {
        return this.client.pushDataToFile(this.id, data, destPath);
    }

    pushFile(srcPath: string, destPath: string): Promise<void> {
        return this.client.pushFile(this.id, srcPath, destPath);
    }

    pullDataFromFile(srcPath: string): Promise<Buffer> {
        return this.client.pullDataFromFile(this.id, srcPath);
    }

    pullFile(srcPath: string, destPath: string): Promise<void> {
        return this.client.pullFile(this.id, srcPath, destPath);
    }

    pull(path: string): Promise<PullTransfer> {
        return this.client.pull(this.id, path);
    }

    push(
        srcPath: string | Readable,
        destPath: string,
        mode?: SyncMode | ExecCallbackWithValue<PushTransfer>
    ): Promise<PushTransfer> {
        return this.client.push(this.id, srcPath, destPath, mode as SyncMode);
    }

    tcpip(port = 5555): Promise<void> {
        return this.client.tcpip(this.id, port);
    }

    usb(): Promise<void> {
        return this.client.usb(this.id);
    }

    waitBootComplete(): Promise<void> {
        return this.client.waitBootComplete(this.id);
    }

    listSettings(mode: SettingsMode): Promise<PropertyMap> {
        return this.client.listSettings(this.id, mode);
    }

    getProp(prop: string): Promise<PropertyValue> {
        return this.client.getProp(this.id, prop);
    }

    setProp(prop: string, value: PrimitiveType): Promise<void> {
        return this.client.setProp(this.id, prop, value);
    }

    getSetting(mode: SettingsMode, name: string): Promise<PropertyValue> {
        return this.client.getSetting(this.id, mode, name);
    }

    putSetting(
        mode: SettingsMode,
        name: string,
        value: PrimitiveType
    ): Promise<void> {
        return this.client.putSetting(this.id, mode, name, value);
    }

    tap(x: number, y: number, source?: InputSource): Promise<void> {
        return this.client.tap(this.id, x, y, source as InputSource);
    }

    text(text: string, source?: InputSource): Promise<void> {
        return this.client.text(this.id, text, source as InputSource);
    }

    keyEvent(
        code: KeyCode | number | NonEmptyArray<number | KeyCode>,
        options?: KeyEventOptions
    ): Promise<void> {
        return this.client.keyEvent(this.id, code, options as KeyEventOptions);
    }

    swipe(
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

    dragAndDrop(
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

    press(source?: InputSource): Promise<void> {
        return this.client.press(this.id, source as InputSource);
    }

    roll(x: number, y: number, source?: InputSource): Promise<void> {
        return this.client.roll(this.id, x, y, source as InputSource);
    }

    custom<T>(
        CustomCommand: TransportCommandConstruct<T>,
        ...args: any[]
    ): Promise<T> {
        return this.client.customTransport<T>(CustomCommand, this.id, args);
    }

    openMonkey(): Promise<Monkey> {
        return this.client.openMonkey(this.id);
    }

    killApp(pkg: string): Promise<void> {
        return this.client.killApp(this.id, pkg);
    }

    exec(cmd: string): Promise<string> {
        return this.client.execDevice(this.id, cmd);
    }

    execShell(cmd: string): Promise<string> {
        return this.client.execDeviceShell(this.id, cmd);
    }

    batteryStatus(): Promise<PropertyMap> {
        return this.client.batteryStatus(this.id);
    }

    rm(path: string, options?: RmOptions): Promise<void> {
        return this.client.rm(this.id, path, options as RmOptions);
    }

    mkdir(path: string, options?: MkDirOptions): Promise<void> {
        return this.client.mkdir(this.id, path, options);
    }

    touch(path: string, options?: TouchOptions): Promise<void> {
        return this.client.touch(this.id, path, options as TouchOptions);
    }

    mv(srcPath: string, destPath: string, options?: MvOptions): Promise<void> {
        return this.client.mv(this.id, srcPath, destPath, options as MvOptions);
    }

    cp(srcPath: string, destPath: string, options?: CpOptions): Promise<void> {
        return this.client.cp(this.id, srcPath, destPath, options as CpOptions);
    }

    fileStat(path: string): Promise<FileStat> {
        return this.client.fileStat(this.id, path);
    }
}
